# Code Samples
I'll showcase some things on Couch since I got to play a lot with metaobjects and creating custom elements. 

## Brand Review Index / couch--search
- https://couch.co/pages/brand-review
- Since the site is mostly metaobjects, we built a custom search with Meilisearch that does a few things throughout the site, rather than looping through the metaobjects in liquid, it was more consistent to just fetch and display them with MS. 

## Brand Review Detail / couch--brand-reviews
- https://couch.co/pages/brand-review/albany-park
- the first thing I made for Couch was the Brand Reviews. And one of the main components was the sticky nav  that linked to certain content blocks. It became one giant section with lots of different block types that if I were to recreate today would be best to utilize Section Groups and Theme Blocks. The theme editor got a bit long winded with just this one section. 
- scroll-margin-top as a CSS property was something I learned while making this, very useful. 


## Brand Comparison Tool - couch--comparison-tool
- https://couch.co/pages/couch-comparison-tool
- another Meilisearch tool to "generate" (but actually search our MS database) a comparison article between any two brands
- We created a new object type in Meili "brand_comparisons", each one is ai generated from the respective Brand Review and then that creates an actual blog post in the Shopify store. So the "brand_comparison" object ends up just having a reference to the blog post. 
