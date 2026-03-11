import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project" && !hidden] | order(year desc, order asc) {
    _id,
    title,
    slug,
    subtitle,
    excerpt,
    year,
    tags,
    featured,
    heroImage {
      asset->,
      alt
    },
    category->{
      title,
      slug
    }
  }
`;

export const projectsByCategory = groq`
  *[_type == "project" && !hidden && category->slug.current == $category] | order(year desc, order asc) {
    _id,
    title,
    slug,
    subtitle,
    excerpt,
    year,
    tags,
    featured,
    heroImage {
      asset->,
      alt
    },
    category->{
      title,
      slug
    }
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && !hidden && featured == true] | order(year desc, order asc) {
    _id,
    title,
    slug,
    subtitle,
    excerpt,
    heroImage {
      asset->,
      alt
    }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    subtitle,
    excerpt,
    year,
    tags,
    heroImage {
      asset->,
      alt
    },
    heroVideo,
    projectInfo,
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      },
      _type == "imageGallery" => {
        ...,
        images[] {
          ...,
          asset->
        }
      },
      _type == "section" => {
        ...,
        sectionContent[] {
          ...,
          _type == "image" => {
            ...,
            asset->
          }
        }
      }
    },
    links,
    category->{
      title,
      slug
    }
  }
`;

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && !hidden].slug.current
`;

