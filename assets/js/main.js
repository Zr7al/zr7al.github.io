// ============================
// PREMIUM PORTFOLIO ANIMATIONS
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // REVEAL ON SCROLL
  // =========================

  const reveals = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));


  // =========================
  // NAVBAR SCROLL EFFECT
  // =========================

  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });


  // =========================
  // COUNTER ANIMATION
  // =========================

  const counters = document.querySelectorAll(".counter");

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let current = 0;

        const increment = target / 60;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });


  // =========================
  // DECIMAL COUNTERS
  // =========================

  const decimalCounters = document.querySelectorAll(".counter-decimal");

  decimalCounters.forEach(counter => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          const target = parseFloat(counter.dataset.target);
          let current = 0;
          const increment = target / 60;

          const update = () => {
            current += increment;
            if (current < target) {
              counter.innerText = current.toFixed(1);
              requestAnimationFrame(update);
            } else {
              counter.innerText = target.toFixed(1);
            }
          };

          update();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.6 });

    observer.observe(counter);
  });


  // =========================
  // PORTFOLIO TILT EFFECT
  // =========================

  const cards = document.querySelectorAll(".work-preview");

  cards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.03)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });

  });


});