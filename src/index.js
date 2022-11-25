import { PixabayApi } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const infiniteScrollEl = document.querySelector('.infinite-scroll');

const pixabayApi = new PixabayApi();

const createGalleryCards = (array) => {
  return array.map(element => { 
    const webformatURL = element.webformatURL;
    const largeImageURL = element.largeImageURL;
    const tags = element.tags;
    const likes = element.likes;
    const views = element.views;
    const comments = element.comments;
    const downloads = element.downloads;
   return `<div class="photo-card">
   <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" width="300px" height="200" loading="lazy"/></a>
   <div class="info">
     <p class="info-item">
     Likes<b>${likes}</b>
     </p>
     <p class="info-item">
     Views<b>${views}</b>
     </p>
     <p class="info-item">
     Comments<b>${comments}</b>
     </p>
     <p class="info-item">
     Downloads<b>${downloads}</b>
     </p>
   </div>
 </div>`
  }).join('');
}

const gallery = new SimpleLightbox('.gallery a', {captionsData:"alt", captionDelay: 250} );

const onSearchFormSubmit = async event => {
    event.preventDefault();

    galleryEl.innerHTML = '';
    pixabayApi.page = 1;
    pixabayApi.searchQuery = event.target.elements.searchQuery.value;

    if(pixabayApi.searchQuery === ''){
      Notify.info("Please type some query in search area!", { fontSize: '16px', width: '250px'},)
      return;
    }
    try {
      const response = await pixabayApi.fetchPhotos();
      const { data } = response;

      let totalPages = Math.ceil(data.total/40);

      if (totalPages === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.", { fontSize: '18px', width: '250px'},)
        return;
      }

      if(totalPages > 1){
      sectionObserver.observe(infiniteScrollEl);
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`, { fontSize: '18px', width: '250px'},) 
    
    galleryEl.insertAdjacentHTML("beforeend", createGalleryCards(data.hits));

   gallery.refresh()
    } catch (err) {
      console.log(err);
    }
}

// const onAclickOpenGallery = (event) => {
//   event.preventDefault() 
//   const {target} = event;
//       if (target.nodeName !== "IMG") {
//           return;
//   } 
 
// }

searchFormEl.addEventListener('submit', onSearchFormSubmit);
// galleryEl.addEventListener('click', onAclickOpenGallery);


const sectionObserver = new IntersectionObserver( async (entries, sectionObserver) => {
  if (entries[0].isIntersecting) {
   
    pixabayApi.page += 1;
  
    try {
      const response = await pixabayApi.fetchPhotos();
      const { data } = response;
      let totalPages = Math.ceil(data.total/40);

      galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));

      gallery.refresh();

      if (totalPages === pixabayApi.page) {
        Notify.info("We're sorry, but you've reached the end of search results.", { fontSize: '16px', width: '250px'},)
        sectionObserver.unobserve(infiniteScrollEl)

      }
    } catch (err) {
      console.log(err);
    }
  }
},
 {
  root: null,
  rootMargin: '0px 0px 400px 0px',
  threshold: 1,
});



