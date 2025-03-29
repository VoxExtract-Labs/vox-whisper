import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '@voxextractlabs/vox-whisper',
  tagline: 'A lightweight Node.js wrapper for the Faster-Whisper Docker CLI',
  favicon: 'img/favicon.ico',

  // Set the production URL of your site here
  url: 'https://voxextract-labs.github.io',
  // For GitHub Pages deployment, set baseUrl to '/vox-whisper/'
  baseUrl: '/vox-whisper/',

  // GitHub pages deployment config.
  organizationName: 'VoxExtract-Labs', // Your GitHub org/user name.
  projectName: 'vox-whisper', // Your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Update this to point to your repo for "Edit this page" links.
          editUrl: 'https://github.com/VoxExtract-Labs/vox-whisper/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Update this to point to your repo for blog "Edit this page" links.
          editUrl: 'https://github.com/VoxExtract-Labs/vox-whisper/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '@voxextractlabs/vox-whisper',
      logo: {
        alt: 'vox-whisper Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'API Reference',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/VoxExtract-Labs/vox-whisper',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'API Reference',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/VoxExtract-Labs/vox-whisper/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/VoxExtract-Labs/vox-whisper',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} VoxExtract Labs`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
