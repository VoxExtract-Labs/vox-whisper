// src/whisperTranscribe.ts

import fs from 'node:fs';
import path from 'node:path';
import type { WhisperConfig } from '@/WhisperConfig.js';
import { WhisperError } from '@/WhisperError.ts';
import { execa } from 'execa';

/**
 * Executes the docker-vox-whisper CLI with the provided configuration options.
 * Automatically checks if the Docker image exists locally and pulls it if necessary.
 *
 * @param config - Configuration options for transcription.
 * @returns A promise that resolves to the transcription result (stdout).
 * @throws {WhisperError} If required configuration options are missing, if the input file does not exist, or if the Docker command fails.
 */
export async function whisperTranscribe(config: WhisperConfig): Promise<string> {
    if (!config.input) {
        throw new WhisperError('The "input" field is required.');
    }
    if (!config.output) {
        throw new WhisperError('The "output" field is required.');
    }
    if (!config.device) {
        throw new WhisperError('The "device" field is required.');
    }
    if (!config.dockerImage) {
        throw new WhisperError('The "dockerImage" field is required.');
    }

    // Resolve absolute paths for input and output
    const resolvedInputPath = path.resolve(config.input);
    const resolvedOutputPath = path.resolve(config.output);

    // Check if the input file exists; if not, throw an error with a clear message.
    if (!fs.existsSync(resolvedInputPath)) {
        throw new WhisperError(`Input file not found: ${resolvedInputPath}`);
    }

    // Ensure the Docker image exists locally; if not, pull it.
    try {
        await execa('docker', ['image', 'inspect', config.dockerImage], { stdio: 'pipe' });
    } catch (error: unknown) {
        console.log(`Docker image ${config.dockerImage} not found locally. Pulling image...`);
        try {
            await execa('docker', ['pull', config.dockerImage], { stdio: 'inherit' });
        } catch (pullError: unknown) {
            throw new WhisperError(`Failed to pull Docker image ${config.dockerImage}`, pullError as Error);
        }
    }

    const inputDir = path.dirname(resolvedInputPath);
    const outputDir = path.dirname(resolvedOutputPath);
    const inputFileName = path.basename(resolvedInputPath);
    const outputFileName = path.basename(resolvedOutputPath);

    // Construct Docker command arguments
    const dockerArgs: string[] = ['run', '--rm'];
    if (config.device === 'cuda') {
        dockerArgs.push('--gpus', 'all');
    }

    // Mount the input and output directories
    dockerArgs.push('-v', `${inputDir}:/app/audio`);
    dockerArgs.push('-v', `${outputDir}:/app/output`);

    // Specify the Docker image
    dockerArgs.push(config.dockerImage);

    // Construct the CLI arguments for the container
    const cliArgs: string[] = [];
    cliArgs.push('--input', `/app/audio/${inputFileName}`);
    cliArgs.push('--output', `/app/output/${outputFileName}`);

    if (config.model) {
        cliArgs.push('--model', config.model);
    }
    if (config.device === 'cuda') {
        cliArgs.push('--device', 'cuda');
    }
    if (config.language) {
        cliArgs.push('--language', config.language);
    }
    if (config.output_format) {
        cliArgs.push('--output_format', config.output_format);
    }
    if (config.timestamps) {
        cliArgs.push('--timestamps');
    }
    if (config.threads !== undefined) {
        cliArgs.push('--threads', config.threads.toString());
    }
    if (config.verbose) {
        cliArgs.push('--verbose');
    }

    // Combine Docker and CLI arguments
    const fullArgs = dockerArgs.concat(cliArgs);

    try {
        const result = await execa('docker', fullArgs, { stdio: 'pipe' });
        return result.stdout;
    } catch (error: unknown) {
        throw new WhisperError('Error executing Docker command', error as Error);
    }
}
