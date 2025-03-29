// src/WhisperConfig.ts

/**
 * Base configuration interface for the CLI options of docker-vox-whisper.
 */
interface WhisperConfigBase {
    /**
     * Path to the input audio file (required).
     */
    input: string;
    /**
     * Output file path for the transcription result (required).
     */
    output: string;
    /**
     * Model size: tiny, base, small, medium, large-*
     */
    model?: 'tiny' | 'base' | 'small' | 'medium' | string;
    /**
     * Inference device: 'cpu' or 'cuda' (required).
     */
    device: 'cpu' | 'cuda';
    /**
     * Language code (default is 'en').
     */
    language?: string;
    /**
     * Output format: 'txt', 'json', or 'srt'.
     */
    output_format?: 'txt' | 'json' | 'srt';
    /**
     * Include word-level timestamps (only applicable for JSON output).
     */
    timestamps?: boolean;
    /**
     * Number of CPU threads to use.
     */
    threads?: number;
    /**
     * Enable debug logging.
     */
    verbose?: boolean;
}

/**
 * Extended configuration interface that includes the Docker image.
 */
export interface WhisperConfig extends WhisperConfigBase {
    /**
     * Docker image to use for running the CLI.
     * Example: 'voxextractlabs/vox-whisper:cpu-v1.0.0' or 'voxextractlabs/vox-whisper:cuda-v1.0.0'
     */
    dockerImage: string;
}
