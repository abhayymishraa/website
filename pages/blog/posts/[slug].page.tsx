import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown, { TableOfContentMarkdown } from '~/components/StyledMarkdown'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const path = 'pages/blog/posts'

export async function getStaticPaths() {
  const files = fs.readdirSync(path)
  const paths = files
    .filter(file => file.substr(-3) === '.md')
    .map((fileName) => ({
      params: {
        slug: fileName.replace('.md', ''),
      }
    }))
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string }}) {
  const fileName = fs.readFileSync(`${path}/${slug}.md`, 'utf-8')
  const { data: frontmatter, content } = matter(fileName)
  return {
    props: {
      frontmatter,
      content,
    }
  }
}

export default function StaticMarkdownPage ({ frontmatter, content }: { frontmatter: any, content: any }) {
  const date = new Date(frontmatter.date)
  console.log('frontmatter', frontmatter)
  console.log('content', content)
  const headlines = content
    .split('\n')
    .filter((line: string) => line.indexOf('## ') === 0 || line.indexOf('# ') === 0)
  console.log('headlines', headlines)

  return (
    <Layout>
      <Head>
        <title>{frontmatter.title}</title>
      </Head>
      <div className='flex flex-col py-12'>
        {frontmatter.date && (
          <div className='text-center text-sm text-slate-500'>
            {date.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        )}
        <h1 className='font-bold text-4xl text-center mt-3'>{frontmatter.title}</h1>
      </div>

      <div className='flex flex-row'>
        <div className='flex self-auto w-[260px] pl-4 pr-8'>
          <div>
            <Link href='/blog'>
              <a className='font-semibold text-sm pb-5 inline-block'>{'<'} Go back to blog</a>
            </Link>
            <div className='pt-6 border-t'>
              {(frontmatter.authors || []).map((author: any, index: number) => {
                return (
                  <div key={index} className='flex flex-row items-center mb-6'>
                    <div
                      className='bg-slate-50 h-[44px] w-[44px] rounded-full mr-3 bg-cover bg-center'
                      style={{ backgroundImage: `url(${author.photo})` }}
                    />
                    <div>
                      <div className='text-sm font-semibold'>{author.name}</div>
                      {author.twitter && (
                        <a className='block text-sm text-blue-500 font-medium' href={`https://twitter.com/${author.twitter}`}>
                          @{author.twitter}
                        </a>
                      )}
                    </div>


                  </div>
                )
              })}
            </div>
            <div className='pt-8'>
              {headlines.map((headline: any, index: number) => {
                return (
                  <div key={index}>
                    <TableOfContentMarkdown markdown={headline} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <div
            className='bg-slate-50 h-[400px] w-full rounded-lg mr-3 bg-cover mb-10 bg-center'
            style={{ backgroundImage: `url(${frontmatter.cover})` }}
          />
          <StyledMarkdown markdown={content} />
        </div>
      </div>

    </Layout>
  )
}
