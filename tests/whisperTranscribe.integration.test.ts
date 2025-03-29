// tests/whisperTranscribe.integration.test.ts

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { WhisperConfig } from '@/WhisperConfig.js';
import { whisperTranscribe } from '@/whisperTranscribe.ts';

const TIMEOUT = 90000;

describe('whisperTranscribe Integration Tests', () => {
    const sampleFile = path.resolve('tests/sample.mp3');
    const outputDir = path.resolve('tmp/test');

    const outputFileName = `output.${Date.now()}.txt`;
    const outputFile = path.join(outputDir, outputFileName);

    beforeAll(async () => {
        if (await fs.exists(outputFile)) {
            await fs.unlink(outputFile);
        }
    });
    afterAll(async () => {
        if (await fs.exists(outputFile)) {
            await fs.unlink(outputFile);
        }
    });

    it(
        'should transcribe the sample audio file and create an output file in tmp/tests',
        async () => {
            // Ensure the temporary output directory exists
            if (!(await fs.exists(outputDir))) {
                await fs.mkdir(outputDir, { recursive: true });
            }

            const config: WhisperConfig = {
                input: sampleFile,
                output: outputFile,
                device: 'cpu',
                dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                language: 'en',
                output_format: 'txt',
            };

            // Run transcription
            const stdout = await whisperTranscribe(config);
            console.log('Transcription stdout:', stdout);

            // Verify that the output file was created and is non-empty
            expect(fs.exists(outputFile)).resolves.toBe(true);
            const transcription = await fs.readFile(outputFile, 'utf8');
            expect(transcription.length).toBeGreaterThan(0);
        },
        TIMEOUT,
    );
});
