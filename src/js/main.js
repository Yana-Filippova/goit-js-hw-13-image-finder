import imagesTpl from '/templates/image.hbs';
import ImageApiService from '/js/apiService.js';
import LoadMoreBtn from '/js/load-more-btn.js';
import { onGalleryItemClick } from '/js/modal.js';
import getRefs from '/js/get-refs.js';
import pnotify from '/js/pnotify.js';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const refs = getRefs();
const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.imagesContainer.addEventListener('click', onGalleryItemClick);

function onSearch(e) {
  e.preventDefault();
  clearImagesContainer();

  imageApiService.query = e.currentTarget.elements.query.value;

  if (imageApiService.query.trim() === '') {
    loadMoreBtn.disable();
    return pnotify.noDataEntered();
  }

  loadMoreBtn.show();
  imageApiService.resetPage();
  clearImagesContainer();
  fetchImages();
}

function fetchImages() {
  loadMoreBtn.disable();

  imageApiService.fetchImages().then(images => {
    appendImagesMarkup(images);
    loadMoreBtn.enable();
    scrollPage();
    scrollUploadedImagesToTop();

    if (images.length <= 12 && images.length === 0) {
      loadMoreBtn.hide();
    }
    if (images.length === 0) {
      pnotify.noMatchesFound();
    }
  });
}

function onLoadMore() {
  fetchImages();
}

function appendImagesMarkup(images) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function scrollPage() {
  loadMoreBtn.refs.button.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function scrollUploadedImagesToTop() {
  window.scrollBy({
    top: 550,
    left: 0,
    behavior: 'smooth',
  });
}
