import { CreateMLCEngine } from "@mlc-ai/web-llm";
import * as path from 'path';
import * as fs from 'fs';
import * as mammoth from 'mammoth';

let chat, messages = [];

export const documentService = {
  async processDocument(file: File): Promise<void> {
    try {
      if (!chat) {
        console.log("Creating MLC engine"); // temporary for testing
        chat = await CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC");
      }
      messages = [
        { role: "system", content: "format any dates in document as: 'event name, date in format mm/dd' Do not write any text other than the event name comma month month slash day day newline. For example: 'Assignment 5, 08/23" },
      ];
      console.log("hello"); // temporary for testing
      /*
      let fileText;
      // Convert the file to text
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Save the file locally
        const localFilePath = path.join('temp', file.name);
        fs.writeFileSync(localFilePath, Buffer.from(await file.arrayBuffer()));
        if (file.type === 'application/pdf'){
          let dataBuffer = fs.readFileSync(localFilePath);
          const pdfData = await pdf(dataBuffer);
          fileText = pdfData.text; 
          console.log("pdf translated"); // temporary for testing 
        }
        else{
          const mammothData = await mammoth.extractRawText({ path: localFilePath });
          fileText =  mammothData.value; 
        }
        // Clean up: Delete the local file after processing
        fs.unlinkSync(localFilePath);
      }
      else{
        fileText = fs.readFileSync(file.name, 'utf8');
      } 

      // The ai can only process 4096 tokens at a time so splitting into chunks of 2500 words
      const words = fileText.split(/\s+/); // Split text into words
      let processed = "";
      for (let i = 0; i < words.length; i += 2500) {
        const chunk = (words.slice(i, i + 2500).join(" ")); // Create a chunk
        messages.push({ role: "user", content: chunk });
        console.log(chunk); // temporary for testing
        const reply = await chat.chat.completions.create({ messages, });
        messages.push({ role: "assistant", content: reply.choices[0].message.content });
        console.log(reply.choices[0].message.content); // temporary for testing
        processed += reply.choices[0].message.content + '\n';
      } 
      
        Possible additions to increase efficiency and user experience:
         - Add a progress bar to show the user how far along the processing is
         - gzip compression, Set proper HTTP caching headers, worker script, turn on webgpu,
           add chat capability to ask when certain deadlines are, ad hour to ai date
      console.log(processed); // temporary for testing */
      messages.push({ role: "user", content: "Exam 2 – Apr 23rd (Wednesday) Assignment 1 – Feb 16th (Sunday) Assignment 2 – Mar 2nd (Sunday) Assignment 3 – Mar 30th (Sunday) Assignment 4 – Apr 20th (Sunday) University Closings: Spring Break - Mar 16th – Mar 23rd  Final Project Team formation Due – Feb 2nd (Sunday) Final Project Proposal Due – Feb th (Sunday) Final Project Deliverable 1 Due – Mar 30th (Sunday) Final Project Deliverable 2 Due – Apr 27th (Sunday) Final Project Presentation Week – Apr 28th, Apr 30th, May 5th, May 7th Assignment and Grading Policy The final grade will be based on programming assignments, exam 1, exam 2 and final projects. Each student is required to complete assignments individually while the project is team effort (Team of FOUR). The final grade will be composed of the following parts: Homework Assignment  			20% Exam 1					20% Exam 2					20% Project						40%" });
      const reply = await chat.chat.completions.create({ messages, });
      console.log(reply.choices[0].message.content); // temporary for testing
      console.log("done"); // temporary for testing
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
}; 