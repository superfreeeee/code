// console.log('load index')

// import { i as I, inc } from './a'
// const i = '???'
// console.log(`i = ${I}`)
// inc()
// console.log(`i = ${I}`)

// console.log(A)

// import * as B from './b'
// console.log('after import B')
// console.log(B)

// import { a } from './b'
// console.log('after import a')
// console.log(a)

// import A from './b'
// console.log('after import A')
// console.log(A)


// const importA = () => import('./a')
// importA().then(A => {
//   A.hi()
// })


console.log('load c.js')
import A from './a'
console.log(A)
import B from './b'
console.log(B)