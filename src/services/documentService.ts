// written by: Andrew Hoberer
// debugged by: Andrew Hoberer
// tested by: Hussnain Yasir 
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import pdfToText from 'react-pdftotext'
import { calendarService } from './calendarService';

let chat, messages = [];

export const documentService = {
  async processDocument(file: File, userId: string, onProgress?: (progress: number) => void): Promise<void> {
    try {
      if (!chat) {
        try {
          chat = await CreateMLCEngine("Llama-3.2-3B-Instruct-q4f32_1-MLC");
        } catch (error) {
          throw new Error("WebGPU must be enabled in your browser to use this feature. Please enable WebGPU in your browser settings or use a browser that supports WebGPU.");
        }
      }
      messages = [
        { role: "system", content: "write every date with its corresponding events and absolutely no other text. Format each line as: 'event name, month day'. For example: 'Assignment 5, January 15'" },
      ];
      
      let fileText;
      // Convert the file to text
      if (file.type === 'application/pdf') {
        fileText = await pdfToText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({arrayBuffer: await file.arrayBuffer()});
        fileText = result.value;
      } else if (file.type === 'text/plain') {
        fileText = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      }
      onProgress?.(30);

      // The ai can only process 4096 tokens at a time so splitting into chunks of 2500 words
      const words = fileText.split(/\s+/); // Split text into words
      let processed = "";
      const totalChunks = Math.ceil(words.length / 2500);
      
      for (let i = 0; i < words.length; i += 2500) {
        const chunk = (words.slice(i, i + 2500).join(" ")); // Create a chunk
        console.log(chunk);
        messages.push({ role: "user", content: chunk });
        const reply = await chat.chat.completions.create({ messages, });
        messages.pop();
        messages.push({ role: "assistant", content: reply.choices[0].message.content });
        processed += reply.choices[0].message.content + '\n';
        console.log(processed);
        
        // Update progress based on chunks processed
        const progress = 30 + Math.floor((i / 2500 / totalChunks) * 40); // 30-70% during AI processing
        onProgress?.(progress);
      }

      // Parse the AI's response and create calendar events
      const lines = processed.split('\n').filter(line => line.trim());
      const totalEvents = lines.length;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Split by the last comma
        const lastCommaIndex = line.lastIndexOf(',');
        if (lastCommaIndex === -1) continue;
        
        const title = line.substring(0, lastCommaIndex).trim();
        const dateStr = line.substring(lastCommaIndex + 1).trim();
        if (!title || !dateStr) continue;

        try {
          // Remove leading single quote from title if present
          const cleanTitle = title.startsWith("'") ? title.slice(1) : title;
          
          // Parse the date
          const [month, dayWithOrdinal] = dateStr.split(' ').map(s => s.trim());
          // Remove ordinal indicators (st, nd, rd, th) from the day
          const day = dayWithOrdinal.replace(/(\d+)(st|nd|rd|th)/, '$1');
          const currentYear = new Date().getFullYear();
          const date = new Date(`${month} ${day}, ${currentYear}`);
          
          // Validate the date
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date format: ${dateStr}`);
            continue;
          }

          // Create calendar event
          await calendarService.addEvent(userId, {
            title: cleanTitle,
            date: date.toISOString().split('T')[0],
            time: '00:00', // Default to midnight
            category: 'Document Import',
            course: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            priority: 'medium',
            description: `Imported from document: ${file.name}`
          });

          // Update progress based on events created
          const progress = 70 + Math.floor((i / totalEvents) * 30); // 70-100% during event creation
          onProgress?.(progress);
        } catch (error) {
          console.warn(`Failed to process date: ${dateStr}`, error);
          continue;
        }
      }
      
      onProgress?.(100); // Complete
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
}; 