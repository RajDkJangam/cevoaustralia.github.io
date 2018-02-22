
var lastIdx = null;
function showRandomTestimonial() {
  var tsList = $("div.testimonial"),
      idx = null;

  if (tsList.length == 0)
    return;
    
  do {
    idx = Math.floor(Math.random() * tsList.length);
  }
  while(idx == lastIdx);
  console.log('show idx:' + idx + ', last:' + lastIdx + ', total:' + tsList.length);
  lastIdx = idx;

  tsList.hide();
  $(tsList[idx]).fadeIn().css("display", "inline-block");
  window.setTimeout(function() {
    $(tsList[idx]).fadeOut();
  }, 9000);
}

$(document).ready(function(){

  // Smooth scrolling via animate()
  $("a").on('click', function(event) {
    if (this.hash && window.location.pathname == this.pathname) {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });

  var maxOffset = 20;
  if ($(window).scrollTop() >= maxOffset) {
    $('.navbar-default').addClass('navbar-shrink');
  }
  else {
    $('.navbar-default').removeClass('navbar-shrink');
  }

  $(window).scroll(function() {
    if ($(window).scrollTop() >= maxOffset) {
      $('.navbar-default').addClass('navbar-shrink');
    }
    else {
      $('.navbar-default').removeClass('navbar-shrink');
    }
  });

  // Handle selected case-study
  if (window.location.hash && window.location.hash.indexOf('#case-study') != -1) {
    $(window.location.hash).modal('toggle');
  }

  // Random testimonials
  showRandomTestimonial();
  window.setInterval(showRandomTestimonial, 15000);
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$.ajaxSetup({
    headers: {  "x-api-key": $('form[id=contactForm]').attr('apikey') }
});

// Async contact form with jquery post
$('form[id=contactForm]').submit(function(){
  $.post($(this).attr('action'), $(this).serialize(), function(data, textStatus, jqXHR){
    $('form[id=contactForm] #success').hide();
    $('form[id=contactForm] #error').hide();
    if (jqXHR.status == 200) {
      $('form[id=contactForm]')[0].reset();
      $('form[id=contactForm] #success').show();
    }}, 'json').fail(function(){
      $('form[id=contactForm] #success').hide();
      $('form[id=contactForm] #error').hide();
      $('form[id=contactForm] #error').show();
  });
  return false;
});

// Contact form validation
$.validate({
  modules : 'html5, toggleDisabled'
});


