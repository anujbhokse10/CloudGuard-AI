'use server';
/**
 * @fileOverview Analyzes log files for anomalies and generates a risk assessment.
 *
 * - analyzeLogsAndGenerateRiskAssessment - A function that handles the log analysis and risk assessment process.
 * - AnalyzeLogsAndGenerateRiskAssessmentInput - The input type for the analyzeLogsAndGenerateRiskAssessment function.
 * - AnalyzeLogsAndGenerateRiskAssessmentOutput - The return type for the analyzeLogsAndGenerateRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLogsAndGenerateRiskAssessmentInputSchema = z.object({
  logData: z.string().describe('The log data in JSON or CSV format.'),
  fileType: z.enum(['json', 'csv']).describe('The type of the log file.'),
});
export type AnalyzeLogsAndGenerateRiskAssessmentInput = z.infer<typeof AnalyzeLogsAndGenerateRiskAssessmentInputSchema>;

const AnalyzeLogsAndGenerateRiskAssessmentOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The risk level of the log data.'),
  anomalies: z.array(z.string()).describe('A list of anomalies found in the log data.'),
  summary: z.string().describe('A summary of the analysis.'),
});
export type AnalyzeLogsAndGenerateRiskAssessmentOutput = z.infer<typeof AnalyzeLogsAndGenerateRiskAssessmentOutputSchema>;

export async function analyzeLogsAndGenerateRiskAssessment(input: AnalyzeLogsAndGenerateRiskAssessmentInput): Promise<AnalyzeLogsAndGenerateRiskAssessmentOutput> {
  return analyzeLogsAndGenerateRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLogsAndGenerateRiskAssessmentPrompt',
  input: {schema: AnalyzeLogsAndGenerateRiskAssessmentInputSchema},
  output: {schema: AnalyzeLogsAndGenerateRiskAssessmentOutputSchema},
  prompt: `You are a security expert analyzing log data for anomalies and determining the risk level.

You will receive log data in either JSON or CSV format. Your task is to identify any anomalies,
determine the risk level (Low, Medium, or High), and provide a summary of your analysis.

Log Data ({{{fileType}}} format):
{{{logData}}}

Respond in the following JSON format:
{
  "riskLevel": "The risk level (Low, Medium, or High)",
  "anomalies": ["List of anomalies found"],
  "summary": "A summary of the analysis"
}

Consider the following factors when determining the risk level and identifying anomalies:
- Unusual patterns or events
- Suspicious IP addresses or user accounts
- Error messages or exceptions
- Security vulnerabilities
- Compliance violations`,
});

const analyzeLogsAndGenerateRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'analyzeLogsAndGenerateRiskAssessmentFlow',
    inputSchema: AnalyzeLogsAndGenerateRiskAssessmentInputSchema,
    outputSchema: AnalyzeLogsAndGenerateRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
