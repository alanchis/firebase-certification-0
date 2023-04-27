// const itemContainer = document.getElementById("item-container");

// export const setupItems = (data) => {
//   if (data.length) {
//     let html = "";
//     data.forEach((doc) => {
//       const item = doc.data();
//       const li = `
//       <section class="articles">
//       <article>
//         <div class="article-wrapper">
//           <figure>
//             <img src="./../../public/images/noItem.png" alt="" />
//           </figure>
//           <div class="article-body">
//             <h1>${item.item}</h2>

//             <p>
//             Added by ${item.user}
//             </p>
//             <p>
//              ${item.date.toDate()}
//             </p>
//             <button type="button" class="btn btn-danger btn-delete ">Delete</button>

//           </div>
//         </div>
//       </article>

//     </section>
//       `;

//       html += li;
//     });
//     itemContainer.innerHTML = html;

//     const btnsDelete = itemContainer.querySelectorAll(".btn-delete");
//     console.log(btnsDelete);
//   } else {
//     itemContainer.innerHTML = "<h1>Add your first item</h1>";
//   }
// };
