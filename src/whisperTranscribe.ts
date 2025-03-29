// src/whisperTranscribe.ts

import fs from 'node:fs/promises';
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
 * @throws {WhisperError} If required configuration options are missing, if the input file is inaccessible, or if the Docker command fails.
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

    // Asynchronously check if the input file exists.
    try {
        await fs.access(resolvedInputPath);
    } catch (err: unknown) {
        throw new WhisperError(`Input file not found or inaccessible: ${resolvedInputPath}`, err as Error);
    }

    // Ensure the output directory exists and update its permissions.
    const outputDir = path.dirname(resolvedOutputPath);
    try {
        await fs.access(outputDir);
        // Adjust permissions if needed.
        await fs.chmod(outputDir, 0o777);
    } catch {
        // Create the directory with broad permissions.
        await fs.mkdir(outputDir, { recursive: true, mode: 0o777 });
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
    const outputFileName = path.basename(resolvedOutputPath);
    const inputFileName = path.basename(resolvedInputPath);

    // Construct Docker command arguments.
    const dockerArgs: string[] = ['run', '--rm'];
    if (config.device === 'cuda') {
        dockerArgs.push('--gpus', 'all');
    }
    dockerArgs.push('-v', `${inputDir}:/app/audio`);
    dockerArgs.push('-v', `${outputDir}:/app/output`);
    dockerArgs.push(config.dockerImage);

    // Construct the CLI arguments for the container.
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

    const fullArgs = dockerArgs.concat(cliArgs);

    try {
        const result = await execa('docker', fullArgs, { stdio: 'pipe' });
        return result.stdout;
    } catch (error: unknown) {
        throw new WhisperError('Error executing Docker command', error as Error);
    }
}
