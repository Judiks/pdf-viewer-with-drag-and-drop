
let url = 'assets/pdf/sstt_2012_3_5.pdf';
let currentPage = 1;
let maxPage = 0;
let PDFFile;
$('#page-counter').text(currentPage);
$('#btn-prev').on('click', function () {
  currentPage--;
  if (currentPage < 1) {
    currentPage++;
    alert("Page can't be less then one")
  }
  getPDFPage(PDFFile);
  $('#page-counter').text(currentPage);
});

$('#btn-next').on('click', function () {
  currentPage++;
  if (currentPage > maxPage) {
    currentPage--;
    alert("Page can't be more then max page count")
  }
  
  getPDFPage(PDFFile);
  $('#page-counter').text(currentPage);
});

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function (pdf) {
  getPDFPage(pdf);
  PDFFile = pdf;
});

function getPDFPage(pdf) {
  pdf.getPage(currentPage).then(function (page) {
    var scale = 1.5;
    var viewport = page.getViewport({ scale: scale });
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    maxPage = pdf.numPages;
    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}

interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '.drag-drop',
  // Require a 100% element overlap for a drop to be possible
  overlap: 1,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    draggableElement.classList.remove('dropped-out');
    //draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.classList.add('dropped-out');
    //event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    //event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

interact('.drag-drop')
  .draggable({
    inertia: true,
    restrict: {
      restriction: "#selectorContainer",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    onmove: dragMoveListener,
  });

function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.dataset = {};
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function showCoordinates() {
  var validi = [];
  var nonValidi = [];

  var maxHTMLx = $('#the-canvas').width();
  var maxHTMLy = $('#the-canvas').height();
  var paramContainerWidth = $('#parametriContainer').width();

  //recupera tutti i placholder validi
  $('.drag-drop.can-drop').each(function (index) {
    debugger
    var maxPDFx = $('#the-canvas').width();
    var maxPDFy = $('#the-canvas').height();
    let paramContainerWidth = $('.drag-drop').width();
    var x = parseFloat(this.dataset.x);
    var y = parseFloat(this.dataset.y);

    var pdfY = y * maxPDFy / maxHTMLy;
    var posizioneY = maxPDFy - pdfY;
    var posizioneX = (x * maxPDFx / maxHTMLx) - paramContainerWidth;

    var val = { currentPage, posizioneX, posizioneY };
    validi.push(val);

  });

  if (validi.length == 0) {
    alert('No placeholder dragged into document');
  }
  else {
    alert(JSON.stringify(validi));
  }
}



