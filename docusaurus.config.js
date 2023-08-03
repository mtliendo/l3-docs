// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Amplify GraphQL API',
	tagline: 'Amplify 🤝 CDK. Empowering developers to focus on app creation.',
	favicon: 'img/favicon.ico',

	// Set the production url of your site here
	url: 'https://main.d1ev9d5gu41bgh.amplifyapp.com',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang.
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			// Replace with your project's social card
			image: 'img/docusaurus-social-card.jpg',
			navbar: {
				title: 'Amplify GraphQL API',
				logo: {
					alt: 'My Site Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'docSidebar',
						sidebarId: 'tutorialSidebar',
						position: 'left',
						label: 'Docs and Tutorials',
					},

					{
						href: 'https://github.com/renebrandel/amplify-cdk-construct-sample',
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
								label: 'Tutorial',
								to: '/docs/',
							},
						],
					},
					{
						title: 'Community',
						items: [
							{
								label: 'Discord',
								href: 'https://discord.gg/amplify',
							},
							{
								label: 'Twitter',
								href: 'https://twitter.com/AWSAmplify',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'GitHub',
								href: 'https://github.com/facebook/docusaurus',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Made with ❤️ by Focus Otter`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
}

module.exports = config
