module.exports = {
  title: 'WINKLink',
  description: 'WINKLink Documentation',
  base: '/v1/doc/',
  locales: {
    '/': {
      lang: 'zh-CN',
      label: '简体中文',
      title: 'WINKLink 开发文档',
      description: 'WINKLink 开发和使用手册'
    },
    '/en/': {
      lang: 'en-US',
      label: 'English',
      title: 'WINKLink Developer Documentation',
      description: 'WINKLink Developer Documentation'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        label: '简体中文',
        sidebar: {
          '/': ['', 'architecture', 'deploy', 'pricing', 'v2', 'proxy', 'glossary', 'vrf'],
        }
      },
      '/en/': {
        label: 'English',
        sidebar: {
          '/en': ['/en/', '/en/architecture', '/en/deploy', '/en/pricing', '/en/v2', '/en/proxy', '/en/glossary', '/en/vrf'],
        }
      }
    },
    sidebar: 'auto',
    sidebarDepth: 4
  },
  markdown: {
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    }
  },
  head: [
    ['link', {
      rel: 'icon',
      href: '/favicon.ico'
    }]
  ],
  plugins: [
    'vuepress-plugin-mermaidjs'
  ]
}
