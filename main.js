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
    let nextPic = ()=>{//不能有任何dom操作，会改变页面结构
        //每次移动2张，因为窗口里只会同时出现2张，不会再多ß
        let nextPosition = (position + 1) % this.data.length

        let current = children[position]
        let next = children[nextPosition]
       
        //动画的起始位置不能有transition
        current.style.transition = "ease 0s"
        next.style.transition = "ease 0s"
        
        //动画的起始位置
        current.style.transform = `translateX(${ -100 * position}%)`
        next.style.transform = `translateX(${100 -100 * nextPosition}%)`

        setTimeout(() => {//transition生效是需要一定的时间的，所以需要settimeout，不能顺次的写
            current.style.transition ="" //means use css rules ease 0.5s
           next.style.transition = ""
            //动画的终止位置
            console.log('end:',`translateX(${-100 -100 * position}%)`,`translateX(${-100 * nextPosition}%)`)
            current.style.transform = `translateX(${-100 -100 * position}%)`
            next.style.transform = `translateX(${-100 * nextPosition}%)`

            position = nextPosition
            console.log('position',position)
        }, 16);

        setTimeout(nextPic,3000)
    }
    nextPic()
   // setTimeout(nextPic,3000)
   //鼠标拖拽
   root.addEventListener('mousedown',(e)=>{
        let startX = e.clientX;
        let nextPosition = (position + 1) % this.data.length
        let lastPosition = (position -1 + this.data.length) % this.data.length //不能直接position -1, 有可能出现负数，因此要加上data.length
        
        let current = children[position]
        let next = children[nextPosition]
        let last = children[lastPosition]

        //初始化transition
        current.style.transition = "ease 0s"
        next.style.transition = "ease 0s"
        last.style.transition = "ease 0s"

        //调整到正确的位置
        //应该用csssom去取以下它们的尺寸
        current.style.transform = `translateX(${ -500 * position}px)`
        last.style.transform = `translateX(${-500 -500 * lastPosition}px)`
        next.style.transform = `translateX(${500 -500 * nextPosition}px)`
        
        let move = event=>{
            //500px的container
            current.style.transform = `translateX(${event.clientX - startX -500 * position}px)`
            last.style.transform = `translateX(${event.clientX - startX -500 - 500 * lastPosition}px)`
            next.style.transform = `translateX(${event.clientX - startX + 500 -500  * nextPosition}px)`

        }
        let up = event=>{//document监听即使离开了浏览器范围也还是会继续监听的
            //拖过一半500/2就认为可以变下一张了
            let offset = 0
            if(event.clientX - startX > 250){
                offset = 1
            }else if(event.clientX - startX <- 250){
                offset = -1
            }

            //加transition打开
            current.style.transition = ""
            next.style.transition = ""
            last.style.transition = ""

            //带动画的transform：和鼠标没有关系了
            current.style.transform = `translateX(${offset*500 -500 * position}px)`
            last.style.transform = `translateX(${offset*500 -500 - 500 * lastPosition}px)`
            next.style.transform = `translateX(${offset*500 + 500 -500  * nextPosition}px)`

            //用取余运算来实现循环的下标
            position = (position - offset + this.data.length) % this.data.length
            
            //remove event
            document.removeEventListener('mousemove',move)
            document.removeEventListener('mouseup',up)
        }
        document.addEventListener('mousemove',move)
        document.addEventListener('mouseup',up)
    })
    return root
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