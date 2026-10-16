(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // Native dialogs retain keyboard focus, Escape, and an accessible modal layer.
  function showDialog(dialog) {
    dialog.showModal(); document.body.classList.add('modal-open'); lenis?.stop();
  }
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lenis?.start(); });
    dialog.addEventListener('wheel', e => e.stopPropagation(), { passive:true });
  });
  function enquire() {
    const dialog = $('#enquiry-dialog');
    $('input[name=message]', dialog).value = '';
    $('.form-status', dialog).textContent = '';
    showDialog(dialog);
  }
  $$('[data-enquire]').forEach(el => el.addEventListener('click', () => enquire()));
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', expanded); $('#navigation').classList.toggle('open', expanded);
  });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    e.preventDefault(); menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open');
    if (lenis) lenis.scrollTo(target, {offset:-75}); else target.scrollIntoView({behavior:reduced ? 'instant' : 'smooth'});
    history.replaceState(null, '', a.hash);
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); $('#navigation').classList.remove('open'); }
  });
  const header = $('#header');
  function onScroll() { header.classList.toggle('fixed', scrollY > 100); }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  $('#year').textContent = new Date().getFullYear();
  $('#read-more').addEventListener('click', e => {
    const button = e.currentTarget, expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', expanded); $('.more-copy').hidden = !expanded;
    button.innerHTML = `${expanded ? 'Read less' : 'Read more'} <span>${expanded ? '↑' : '→'}</span>`;
    window.ScrollTrigger?.refresh();
  });

  let currentSlide = 1;
  const slides = $$('.gallery-slide');
  function gallery(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      let position = (i - currentSlide + slides.length) % slides.length;
      if (position > slides.length / 2) position -= slides.length;
      const mobile = innerWidth <= 760;
      const spacing = mobile ? 84 : 78;
      const scale = position === 0 ? 1 : Math.abs(position) === 1 ? .73 : .5;
      slide.style.transform = `translate(calc(-50% + ${position * spacing}%), -50%) scale(${scale})`;
      slide.style.opacity = position === 0 ? 1 : Math.abs(position) === 1 ? .48 : .2;
      slide.style.zIndex = 5 - Math.abs(position);
      slide.classList.toggle('active', i === currentSlide);
      slide.setAttribute('aria-label', `${i+1} of ${slides.length}: ${$('img', slide).alt}${i === currentSlide ? ', enlarge image' : ', select image'}`);
    });
    $('.gallery-count').innerHTML = `0${currentSlide+1} <i>/ 05</i>`;
  }
  $$('[data-slide]').forEach(b => b.addEventListener('click', () => gallery(currentSlide + Number(b.dataset.slide))));
  function enlarge(src, caption) {
    const dialog = $('#image-dialog'); $('img', dialog).src = src; $('img', dialog).alt = caption; $('p', dialog).textContent = caption; showDialog(dialog);
  }
  slides.forEach((slide,i) => slide.addEventListener('click', () => {
    if (currentSlide !== i) gallery(i); else enlarge($('img',slide).src, $('img',slide).alt);
  }));
  let touchStart;
  $('.gallery-track').addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
  $('.gallery-track').addEventListener('touchend', e => {
    const distance = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 40) gallery(currentSlide + (distance < 0 ? 1 : -1));
  }, {passive:true});
  $('.gallery').addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); gallery(currentSlide + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  addEventListener('resize', () => gallery(currentSlide)); gallery(1);

  const amenities = {
    wellness:[['Infinity Pool with Sea Views','Unwind at the water’s edge, with an infinity pool opening out to sweeping views of the Arabian Sea.','pool-towers.webp'],['State-of-the-art Fitness Centre','A dedicated space for your everyday fitness routine and a more balanced way of life.','living-room-two.webp']],
    social:[['Clubhouse & Lounge','Beautifully considered spaces to catch up, come together and enjoy moments with your community.','living-room.webp'],['Multi-purpose Hall','A versatile setting for celebrations, gatherings and the occasions that bring people together.','living-room-three.webp']],
    leisure:[['Landscaped Podium Gardens','Thoughtfully designed green spaces for quiet pauses, fresh air and a connection with nature.','pool-towers.webp'],['Kids’ Play Area','A dedicated place for little imaginations to explore and everyday friendships to grow.','hero-dusk.webp']]
  };
  let category = 'wellness', amenityIndex = 0;
  function renderAmenities() {
    const list = $('#amenity-panel'); list.replaceChildren();
    list.setAttribute('aria-labelledby', `tab-${category}`);
    amenities[category].forEach((a,i) => {
      const row = document.createElement('div'); row.className = `amenity-item${i === amenityIndex ? ' active' : ''}`;
      row.innerHTML = `<button aria-expanded="${i === amenityIndex}" aria-controls="amenity-description-${i}"><small>0${i+1}</small><strong>${a[0]}</strong><span>${i === amenityIndex ? '−' : '↗'}</span></button><p id="amenity-description-${i}" ${i !== amenityIndex ? 'hidden' : ''}>${a[1]}</p>`;
      $('button',row).addEventListener('click', () => { amenityIndex = i; renderAmenities(); });
      list.append(row);
    });
    const active = amenities[category][amenityIndex];
    $('#amenity-image').src = `img/ai/${active[2]}`; $('#amenity-image').alt = `AI lifestyle illustration for ${active[0]}`;
    $('#amenity-title').textContent = active[0]; $('#amenity-category').textContent = `${category.toUpperCase()} · 0${amenityIndex+1}`;
  }
  $$('[data-category]').forEach(tab => tab.addEventListener('click', () => {
    category = tab.dataset.category; amenityIndex = 0;
    $$('[data-category]').forEach(t => { t.setAttribute('aria-selected', t === tab); t.tabIndex = t === tab ? 0 : -1; }); renderAmenities();
  }));
  renderAmenities();
  const plans = [{area:'2,900',file:'2900',price:'33'},{area:'3,500',file:'3500',price:'40'},{area:'4,100',file:'4100',price:'50'}];
  let planIndex = 0;
  $$('[data-plan]').forEach(tab => tab.addEventListener('click', () => {
    planIndex = Number(tab.dataset.plan); const plan = plans[planIndex];
    $$('[data-plan]').forEach(t => {t.setAttribute('aria-selected', t === tab);t.tabIndex = t === tab ? 0 : -1;});
    $('#plan-panel').setAttribute('aria-labelledby', tab.id);
    $('#plan-image').src = `img/plans/4bhk-${plan.file}.webp`; $('#plan-image').alt = `4 BHK Type ${planIndex+1} floor plan, ${plan.area} square feet`;
    $('#plan-type').textContent = `4 BHK · TYPE 0${planIndex+1}`; $('#plan-price').textContent = `₹${plan.price} Cr*`;
  }));
  $('.plan-image').addEventListener('click', () => enlarge($('#plan-image').src, $('#plan-image').alt));
  $('#request-plan').addEventListener('click', () => enquire());
  $$('[role=tablist]').forEach(list => list.addEventListener('keydown', e => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
    e.preventDefault(); const tabs = $$('[role=tab]',list), index = tabs.indexOf(document.activeElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : (index+(e.key === 'ArrowRight'?1:-1)+tabs.length)%tabs.length;
    tabs[next].click(); tabs[next].focus();
  }));
  $$('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) $$('.faq details').filter(d => d !== detail).forEach(d => {d.open = false;});
  }));

  // Match the reference’s reveal, parallax, count-up and scroll-driven sequences.
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
    // Rebuild animations at layout breakpoints so cached transforms cannot
    // carry desktop positioning into the stacked mobile layout (or vice versa).
    gsap.matchMedia().add({
      mobile: '(max-width: 760px)',
      desktop: '(min-width: 761px) and (min-height: 761px)',
      laptop: '(min-width: 761px) and (max-height: 760px)'
    }, () => {
    const repeatOnScroll = trigger => ({trigger,start:'top 92%',toggleActions:'restart reset restart reset',invalidateOnRefresh:true});
    gsap.from('.hero h1 b', {yPercent:115,duration:1.35,stagger:.13,ease:'power4.out',delay:1,scrollTrigger:repeatOnScroll('.hero-title')});
    gsap.from('.hero-form', {x:40,opacity:0,duration:1.2,delay:1.3,scrollTrigger:repeatOnScroll('.hero-form')});
    gsap.from('.hero-stats>div', {y:20,opacity:0,duration:.9,stagger:.1,delay:1.5,scrollTrigger:repeatOnScroll('.hero-stats')});
    $$('.reveal').forEach(el => gsap.from(el, {y:45,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:repeatOnScroll(el)}));
    $$('[data-count]').forEach(el => {
      const target = Number(el.dataset.count), value = {n:0};
      gsap.fromTo(value,{n:0},{n:target,duration:2,ease:'power2.out',scrollTrigger:{trigger:'.numbers',start:'top 90%',toggleActions:'restart reset restart reset'},onUpdate:()=>{el.textContent=target%1 ? value.n.toFixed(2) : Math.round(value.n);}});
    });
    gsap.to('.immersive-sticky>img', {scale:1.2,ease:'none',scrollTrigger:{trigger:'.immersive',start:'top top',end:'bottom bottom',scrub:1}});
    gsap.to('.immersive-copy', {y:-65,ease:'none',scrollTrigger:{trigger:'.immersive',start:'top top',end:'bottom bottom',scrub:1}});
    gsap.to('.experience-progress>span', {width:'100%',ease:'none',scrollTrigger:{trigger:'.immersive',start:'top top',end:'bottom bottom',scrub:true}});
    });
    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (innerWidth > 1100) {
        menu.setAttribute('aria-expanded', 'false');
        $('#navigation').classList.remove('open');
      }
      lenis?.resize();
      window.ScrollTrigger?.refresh();
    }, 150);
  });
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
    const cursor = $('.cursor');
    addEventListener('pointermove', e => {cursor.style.left=`${e.clientX-15}px`;cursor.style.top=`${e.clientY-15}px`;}, {passive:true});
    document.addEventListener('pointerover', e => cursor.classList.toggle('hover',!!e.target.closest('a,button,summary')));
  }
})();
