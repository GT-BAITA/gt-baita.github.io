export function CustomLink({
  text,
  ...props
}: { text: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" className="underline" {...props}>
      {text}
    </a>
  );
}
