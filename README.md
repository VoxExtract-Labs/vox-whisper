[![NPM](https://img.shields.io/npm/v/@voxextractlabs/vox-whisper?label=npm)](https://www.npmjs.com/package/@voxextractlabs/vox-whisper)
[![License](https://img.shields.io/npm/l/@voxextractlabs/vox-whisper)](./LICENSE)
[![Build Status](https://github.com/VoxExtract-Labs/vox-whisper/actions/workflows/pr-check.yml/badge.svg)](https://github.com/VoxExtract-Labs/vox-whisper/actions/workflows/pr-check.yml)
[![codecov](https://codecov.io/gh/VoxExtract-Labs/vox-whisper/graph/badge.svg?token=BIYV66POTD)](https://codecov.io/gh/VoxExtract-Labs/vox-whisper)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3c68d4afd088475a8fde5b00277cec2f)](https://app.codacy.com/gh/VoxExtract-Labs/vox-whisper/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@voxextractlabs/vox-whisper)](https://bundlephobia.com/package/@voxextractlabs/vox-whisper)

# @voxextractlabs/vox-whisper

## Project Summary and Key Features

- **Fast Transcription:** A lightweight wrapper around the Faster-Whisper Docker CLI.
- **Cross-Platform:** Designed to work with Node.js and Bun.
- **Configurable:** Supports CPU and GPU inference along with various runtime options.
- **Modern Tooling:** Integrates Biome, conventional commits, lefthook, and more.

## Installation

Install the package via bun or your preferred package manager:

```sh
bun add @voxextractlabs/vox-whisper
yarn add @voxextractlabs/vox-whisper
npm install @voxextractlabs/vox-whisper
```

## Usage Example

```ts
import { whisperTranscribe } from '@voxextractlabs/vox-whisper';

const result = await whisperTranscribe({
    input: 'path/to/audio.wav',
    output: 'tmp/output/result.txt',
    device: 'cpu',
    dockerImage: 'voxextractlabs/vox-whisper:cpu-v1.0.0'
});

console.log('Transcription result:', result);
```

## Configuration Details

The function accepts a `WhisperConfig` object with the following fields:

| Property         | Type               | Description                                  |
|------------------|--------------------|----------------------------------------------|
| `input`          | `string`           | Path to the input audio file                 |
| `output`         | `string`           | Path where the transcription will be written |
| `device`         | `'cpu' \| 'cuda'`  | Inference device                             |
| `dockerImage`    | `string`           | Docker image to use                          |
| `model`          | `string?`          | Model size: `tiny`, `base`, `small`, etc.    |
| `language`       | `string?`          | Language code (e.g. `en`)                    |
| `output_format`  | `string?`          | Format: `txt`, `json`, `srt`                 |
| `timestamps`     | `boolean?`         | Include word-level timestamps (JSON only)    |
| `threads`        | `number?`          | Number of CPU threads                        |
| `verbose`        | `boolean?`         | Enable verbose/debug logging                 |

## Contribution Guidelines

Contributions are welcome! Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification and run pre-commit hooks using Lefthook. Ensure that your code passes all lint checks, tests, and includes docs where appropriate.

## License and Acknowledgments

Licensed under the [MIT License](./LICENSE).  
Special thanks to the contributors and the open-source community for their invaluable support.

