function createElement(Cls, attributes, ...children){
  let o;
  if(typeof Cls === "string") {
      o = new Wrapper(Cls);
  } else {
      o = new Cls({
          timer: {}
      });
  }
  for(let name in attributes) {
      o.setAttribute(name,attributes[name]);
  }
  //console.log(children);
  function visit(children){
    for(let child of children) {
        if (child instanceof Array) {
            visit(child)
            continue;
        } else if(typeof child === "string") {
          child = new Text(child);
        } 
        o.appendChild(child);
    }
  }
  visit(children)
  return o;
}

class Text {
  constructor(text){
      this.children = [];
      this.root = document.createTextNode(text);
  }
  mountTo(parent){
      parent.appendChild(this.root);
  }
}

class Wrapper{
  constructor(type){
      this.children = [];
      this.root = document.createElement(type);
  }

  setAttribute(name, value) { //attribute
      this.root.setAttribute(name, value);
  }

  appendChild(child){
      this.children.push(child);
  }

  addEventListener() {
      this.root.addEventListener(...arguments);
  }
  get style() {
      return this.root.style
  }
  mountTo(parent){
      parent.appendChild(this.root);
      for(let child of this.children){
          child.mountTo(this.root);
      }
  }

}

class Carousel {
  constructor(config){
      this.children = [];
  }

  setAttribute(name, value) {
      this[name] = value;
  }

  render(){
    let children = this.data.map(url => {
        let element = <img src={url} />
        element.addEventListener('dragstart', (e) => e.preventDefault());
        return element;
    });
    let root = <div class="carousel">{children}</div>;

    let position = 0;
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];

      current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${-100 * position}%)`;
      next.style.transform = `translateX(${-100 - 100 * nextPosition}%)`;

      setTimeout(() => {
        current.style.transition = '';
        next.style.transition = '';
        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${-100 * nextPosition}%)`;
        position = nextPosition;
      }, 16);

      setTimeout(nextPic, 1000);
    };
    nextPic();

    root.addEventListener('mousedown', (event) => {
        let startX = event.clientX,
          startY = event.clientY;
        let baseX = 0,
          baseY = 0;

        let nextPosition = (position + 1) % this.data.length;
        let lastPosition =
          (position - 1 + this.data.length) % this.data.length;
        let current = children[position];
        let next = children[nextPosition];
        let last = children[lastPosition];
        current.style.transition = 'ease 0s';
        next.style.transition = 'ease 0s';
        last.style.transition = 'ease 0s';

        current.style.transform = `translateX(${-500 * position}px)`;
        last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;
        let move = (event) => {
          let offsetX = event.clientX - startX;
          current.style.transform = `translateX(${
            offsetX - 500 * position
          }px)`;
          last.style.transform = `translateX(${
            offsetX - 500 - 500 * lastPosition
          }px)`;
          next.style.transform = `translateX(${
            offsetX + 500 - 500 * nextPosition
          }px)`;
          // console.log(event.clientX - startX, event.clientY - startY);
        };
        let up = (event) => {
          let offset = 0;
          if (event.clientX - startX > 250) {
            offset = 1;
          } else if (event.clientX - startX < -250) {
            offset = -1;
          }
          current.style.transition = '';
          next.style.transition = '';
          last.style.transition = '';
          current.style.transform = `translateX(${
            offset * 500 - 500 * position
          }px)`;
          last.style.transform = `translateX(${
            offset * 500 - 500 - 500 * lastPosition
          }px)`;
          next.style.transform = `translateX(${
            offset * 500 + 500 - 500 * nextPosition
          }px)`;
          position =
            (position + offset + this.data.length) % this.data.length;
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
      });


      
      return root;
  }

  mountTo(parent){
      this.render().mountTo(parent)
  }
}


let component = <Carousel data={[
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
  ]}/>
  

component.mountTo(document.body);


console.log(component);

//componet.setAttribute("id", "a");