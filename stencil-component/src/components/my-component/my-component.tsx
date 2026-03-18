import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() content: Record<string, any>;

  render() {
    return <div>Hello, World! Content: {this.content?.title}</div>;
  }
}
