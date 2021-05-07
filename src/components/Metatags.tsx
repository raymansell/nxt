/* eslint-disable react/require-default-props */
import Head from 'next/head';

interface MetatagsProps {
  title: string;
  description: string;
  image?: string;
}

const Metatags = ({
  title = 'Social blogging platform. Built with Next.js, TypeScript and Firebase',
  image = 'https://i.imgur.com/8JMIyQE.png',
  description = 'Complete Next.js + Firebase social blogging community',
}: MetatagsProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
    </Head>
  );
};

export default Metatags;
