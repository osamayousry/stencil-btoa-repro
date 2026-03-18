import { MyComponent } from "stencil-component/react";

export default function Home() {
  // Characters outside Latin1 range that trigger btoa InvalidCharacterError
  const content = {
    title: "Price: 100€",
    subtitle: "日本語テスト",
  };

  return (
    <main>
      <h1>Stencil btoa Unicode Reproduction</h1>
      <MyComponent content={content} />
    </main>
  );
}
