import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummariseCommit = async (diff: string) => {
  const response = await model.generateContent([
    `You are an expert programmer and you are trying to summarize a git diff. 
Reminder about the git diff format: 
For every file there are a few metadata line like (for example): 
\'\'\' 
diff --git a/lib/index.js b/lib/index.js 
index aadf891..bfef003 1005644 
--- a/lib/index.js 
+++b/lib/index.js 
\'\'\' 
This means that \'lib/index.js\' was modified in this commit . Note that this is only an example.
Then there is a specific of the lines that are modified.
A line starting with \'+\' means it was added.
A line starting with \'-\' means that line was deleted.
A line that starts with neither \'+\' nor \'-\' is the code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\'\'\' 
* Raised the amount of the returned recordings from \'10\' to \'100\' [pacakages/server/recordings.ts]. [pacakages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt.commit.summarize.yml]
* Moved the \'octokit\' initialization to a seperate file [src/octokit.ts]. [src/index.ts]
* Added an OpenAI API for completions [pacakages/utils/openai.ts]
* Lowered numeric tolerance for test files
\'\'\' 
Most commits will have less comments than this examples list.
The last comment does not include the file names.
because there were more than two relevant files in the hypothetical commit.`,
    `Please summmarize the following diff file : \n\n${diff}`,
  ]);
  return response.response.text();
};

export async function summariseCode(doc: Document) {
  const code = doc.pageContent.slice(0, 10000);
  try {
    const response = await model.generateContent([
      "You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects",
      `You are onboarding a junior software engineer and explaning to them the purpose of the ${doc.metadata.source} file Here is the code :
    ---
    ${code}
    ---
    Give a summary no more than 150 words of the code above`,
    ]);

    return response.response.text();
  } catch (error) {
    console.log(error);
    return "";
  }
}

export async function generateEmbedding(summary: string) {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });
  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
}
