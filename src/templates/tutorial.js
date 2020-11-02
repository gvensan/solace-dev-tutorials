import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Sidebar from "../components/sidebar"
import { Container } from "react-bootstrap"
import { Breadcrumb } from "gatsby-plugin-breadcrumb"

const tutorial = ({ data, pageContext }) => {
  const {
    breadcrumb: { crumbs },
  } = pageContext
  const node = data.tutorialBody.edges[0].node
  const tutorials = data.tableOfContent.edges.filter(
    (edge) => edge.node.frontmatter.layout === "tutorials"
  )
  const features = data.tableOfContent.edges.filter(
    (edge) => edge.node.frontmatter.layout === "features"
  )
  const feedback = node.frontmatter.links.filter(
    (link) => link.label === "feedback"
  )
  const feedback_link = feedback[0].link || ""
  const section_title = data.allTutorialsYaml.edges[0].node.section1
  
  return (
    <Layout>
      <section id="breadcrumbs">
        <Container>
          <Breadcrumb
            crumbs={crumbs}
            crumbLabel={node.frontmatter.title}
            crumbSeparator=" 👉 "
          />
        </Container>
      </section>
      <Container className="flex-row">
        <div className="max-w-70 mt4 mb4">
          <h1>{node.frontmatter.title}</h1>
          <h5 id="minutes" className="mb3 pt2">
            {node.timeToRead} Minute Read
          </h5>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </div>
        <Sidebar
          features = {features} 
          tutorials = {tutorials} 
          feedback_link = {feedback_link} 
          section_title = {section_title} 
          pageContext = {pageContext} 
        ></Sidebar>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query myTutorialQuery($slug: String, $slugRoot: String) {
    tutorialBody: allMarkdownRemark(
      filter: { fields: { slug: { eq: $slug } } }
    ) {
      edges {
        node {
          html
          timeToRead
          fields {
            slug
            slugRoot
          }
          frontmatter {
            title
            summary
            layout
            links {
              label
              link
            }
          }
        }
      }
    }
    allTutorialsYaml(filter: { fields: { slugRoot: { eq: $slugRoot } } }) {
      edges {
        node {
          section1
        }
      }
    }
    tableOfContent: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/^(?!.*assets).*$/" }
        fields: { slugRoot: { eq: $slugRoot } }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            layout
          }
          fields {
            slug
            slugRoot
          }
          id
          fileAbsolutePath
        }
      }
    }
  }
`

export default tutorial