import Helmet from "react-helmet";

const HeadTags = ({ title, description, imageLink }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="description"
        key="description"
        content={
          description ??
          "Welcome to Nexus, the vibrant departmental cell of Computer Science and Engineering at Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. Nexus serves as a dynamic hub for computer science enthusiasts, envisioning a community where students come together to thrive and excel. Our mission is to create an environment that goes beyond academic boundaries, fostering holistic growth and learning. As the official departmental cell, we aim to be the catalyst for innovation and excellence in the field of computer science at SVNIT. Join Nexus for academic excellence, collaboration, impactful events, and a supportive network that empowers students with knowledge, skills, and resources to succeed both academically and professionally."
        }
      />
      <meta name="title" key="title" content={title ?? "Nexus NIT Surat"} />
      <meta
        property="og:title"
        key="og:title"
        content={title ?? "Nexus NIT Surat"}
      />
      <meta property="og:locale" key="og:locale" content="en_US" />
      <meta charSet="utf-8" />
      <meta property="og:type" key="og:type" content="website" />
      <meta
        property="og:description"
        key="og:description"
        content={
          description ??
          "Welcome to Nexus, the vibrant departmental cell of Computer Science and Engineering at Sardar Vallabhbhai National Institute of Technology (SVNIT) Surat. Nexus serves as a dynamic hub for computer science enthusiasts, envisioning a community where students come together to thrive and excel. Our mission is to create an environment that goes beyond academic boundaries, fostering holistic growth and learning. As the official departmental cell, we aim to be the catalyst for innovation and excellence in the field of computer science at SVNIT. Join Nexus for academic excellence, collaboration, impactful events, and a supportive network that empowers students with knowledge, skills, and resources to succeed both academically and professionally."
        }
      />
      <meta
        property="og:image"
        key="og:image"
        content={
          imageLink ?? `${process.env.BASE_URL}/public/assets/NEXUStext.png`
        }
      />
    </Helmet>
  );
};
export default HeadTags;
