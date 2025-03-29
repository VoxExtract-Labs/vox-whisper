// tests/whisperTranscribe.unit.test.ts

import { afterAll, describe, expect, it, jest, mock, spyOn } from 'bun:test';
import fs from 'node:fs';
import type { WhisperConfig } from '@/WhisperConfig.ts';
import { WhisperError } from '@/WhisperError.ts';
import { whisperTranscribe } from '@/whisperTranscribe.ts';
import { execa } from 'execa';

const originalExeca = execa;

const mockedExeca = mock(async (...args: unknown[]) => {
    const cmd = args[0] as string;
    const cmdArgs = args[1] as string[];
    return {
        stdout: [cmd, ...cmdArgs].join('||'),
    };
});

// Override the execa module with our default mock implementation.
mock.module('execa', () => ({
    execa: mockedExeca,
}));

describe('whisperTranscribe Unit Tests', () => {
    afterAll(() => {
        mock.restore();
        mock.module('execa', () => ({
            execa: originalExeca,
        }));
    });

    describe('Configuration validation', () => {
        it('should throw an error if input is missing', () => {
            expect(
                whisperTranscribe({
                    input: '',
                    output: 'temp/test/result.txt',
                    device: 'cpu',
                    dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                }),
            ).rejects.toThrow(WhisperError);
        });

        it('should throw an error if output is missing', () => {
            expect(
                whisperTranscribe({
                    input: 'tests/sample.mp3',
                    output: '',
                    device: 'cpu',
                    dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                }),
            ).rejects.toThrow(WhisperError);
        });

        it('should throw an error if device is missing', () => {
            const config = {
                input: 'tests/sample.mp3',
                output: 'temp/test/result.txt',
                dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
            } as unknown as WhisperConfig;
            expect(whisperTranscribe(config)).rejects.toThrow(WhisperError);
        });

        it('should throw an error if dockerImage is missing', () => {
            const config = {
                input: 'tests/sample.mp3',
                output: 'temp/test/result.txt',
                device: 'cpu',
            } as unknown as WhisperConfig;
            expect(whisperTranscribe(config)).rejects.toThrow(WhisperError);
        });
    });

    describe('File existence check', () => {
        it('should throw a clear error if the input file does not exist', async () => {
            const nonExistentInput = '/path/to/nonexistent/input.mp3';
            const config: WhisperConfig = {
                input: nonExistentInput,
                output: 'temp/test/result.txt',
                device: 'cpu',
                dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                language: 'en',
            };

            // Temporarily override fs.existsSync to simulate that the file does not exist.
            spyOn(fs, 'existsSync').mockReturnValueOnce(false);
            expect(whisperTranscribe(config)).rejects.toThrowError(
                new RegExp(`Input file not found: ${nonExistentInput}`),
            );
        });
    });

    describe('Docker command construction', () => {
        it('should build the correct docker command for CPU', async () => {
            const config: WhisperConfig = {
                input: 'tests/sample.mp3',
                output: 'temp/test/result.txt',
                device: 'cpu',
                dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                language: 'en',
            };

            const output = await whisperTranscribe(config);
            // The output should include the Docker image.
            expect(output).toContain('voxextractlabs/vox-whisper:cpu-v1.0.0');
            // CPU configuration should NOT include the GPU flag.
            expect(output).not.toContain('--gpus||all');
            // Must include the --input and --output parameters mapped to container paths.
            expect(output).toContain('--input||/app/audio/sample.mp3');
            expect(output).toContain('--output||/app/output/result.txt');
        });

        it('should build the correct docker command for CUDA', async () => {
            const config: WhisperConfig = {
                input: 'tests/sample.mp3',
                output: 'temp/test/result.txt',
                device: 'cuda',
                dockerImage: 'voxextractlabs/vox-whisper:cuda-v1.0.0',
                language: 'en',
            };

            const output = await whisperTranscribe(config);
            // CUDA configuration should include the GPU flag.
            expect(output).toContain('--gpus||all');
            // And the CLI arguments should include "--device||cuda".
            expect(output).toContain('--device||cuda');
        });
    });

    describe('Docker image check and pull', () => {
        it('should pull the docker image if inspect fails', async () => {
            // Create a local mock that simulates a failure on the inspect command.
            let callCount = 0;
            const localMockedExeca = mock(async (...args: unknown[]) => {
                const cmd = args[0] as string;
                const cmdArgs = args[1] as string[];
                callCount++;
                // Simulate failure when inspecting the image.
                if (cmd === 'docker' && cmdArgs[0] === 'image' && cmdArgs[1] === 'inspect') {
                    throw new Error('Image not found');
                }
                return {
                    stdout: [cmd, ...cmdArgs].join('||'),
                };
            });
            // Override execa with the local mock for this test.
            mock.module('execa', () => ({
                execa: localMockedExeca,
            }));

            const config: WhisperConfig = {
                input: 'tests/sample.mp3',
                output: 'temp/test/result.txt',
                device: 'cpu',
                dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0',
                language: 'en',
            };

            const output = await whisperTranscribe(config);
            // Expect that the inspect call failed and then a pull was attempted.
            // The call count should be at least 3 (one for inspect, one for pull, and one for docker run).
            expect(callCount).toBeGreaterThanOrEqual(3);
            // The output should still include the docker image as part of the docker run command.
            expect(output).toContain('voxextractlabs/vox-whisper:cpu-v1.0.0');

            // Reset the module override back to the default for subsequent tests.
            mock.module('execa', () => ({
                execa: mockedExeca,
            }));
        });
    });
});
