import { siteConfig } from './lib/site-config';


export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '660d1a8fa22a457ebab29e3d8c8af854',
  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  //rootNotionSpaceId: 'f2b063ab-5763-4522-82a6-f18f4aaa1c70',
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Lesson',
  domain: 'coalacoding.notion.site',
  author: 'coalacoding',

  // open graph metadata (optional)
  description: 'Frontend 공부방',

  // social usernames (optional)
  //twitter: 'transitive_bs',
  github: 'qwerewqwerew',
  //linkedin: 'fisch2',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  youtube: 'channel/UCMb94yucTNsjIJqD8C8lO2Q',

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages. To use `navigationLinks`, set `navigationStyle` to `custom`.
  //navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'React',
      pageId: '3fa9c6473aac49e3be09d7c7cda924f4'
    },
    {
      title: 'Javascript',
      pageId: 'dd72dfb6e7d0472399bc4840448ced29'
    },
    {
      title: 'HTML/CSS',
      pageId: '643e64a0be9f43aaad03803436e8132d'
    },
    {
      title: 'GoogleAnalytics',
      pageId: '2b8e85e1167142fea7078aae35e7247e'
    },
    {
      title: 'Git',
      pageId: '141d54a2691240e889bc3a6b5f932acf'
    },
    {
      title: 'Effects',
      pageId: '844ad9fe16104afd863290f2db3da1d0'
    }
  ],
  enableComment: true
})