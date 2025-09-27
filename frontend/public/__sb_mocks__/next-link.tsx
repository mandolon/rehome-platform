import React from "react"; const Link = ({ href, children, ...rest }: any) => <a href={href as string} {...rest}>{children}</a>; export default Link;
