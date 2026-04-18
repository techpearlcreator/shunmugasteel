function roundText() {
    const roundedTextElements = document.querySelectorAll('.zs-rounded-text .zpelem-text');
    
    if (roundedTextElements.length) {
      roundedTextElements.forEach((textElement) => {
        textElement.style.animation = "rotate360 9s linear infinite"; // No I18N
        const chars = textElement.innerText.split("");
        const totalChars = chars.length + 2;
        const angleIncrement = 180 / totalChars;
        const roundedText = [];
    
        roundedText.push(`<span style="transform:rotate(0deg) translate(0, 0px) scale(-1)"></span>`);
        chars.forEach((char, i) => {
          const rotation = (i + 2) * angleIncrement;
          roundedText.push(`<span style="transform:rotate(${rotation}deg) translate(0, 0px)">${char}</span>`);
        });
    
        roundedText.push(`<span style="transform:rotate(0deg) translate(0, 0px) scale(-1)"></span>`);
    
        chars.forEach((char, i) => {
          const rotation = (i + 2) * angleIncrement;
          roundedText.push(`<span style="transform:rotate(${rotation}deg) translate(0, 0px) scale(-1)">${char}</span>`);
        });
    
        textElement.innerHTML = roundedText.join("");
      });
    }
  }
      
  function drag() {
    const slider = document.getElementById('zs-input-slider');
    const dragLine = document.querySelector('.zs-drag-line');
    const comparisonImage = document.querySelector('.zs-comparison-image');
  
    if (slider && dragLine && comparisonImage) {
      const sliderValue = slider.value + '%';
      dragLine.style.left = sliderValue;
      comparisonImage.style.clipPath = `polygon(0% 0%, ${sliderValue} 0%, ${sliderValue} 100%, 0% 100%)`;
    }
  }
  function addDragLine() {
    const addInputSlider = document.querySelector('.zs-comparison-image');
  
    if (addInputSlider) {
      addInputSlider.style.position = "absolute";
      addInputSlider.style.clipPath = "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";
  
      const sliderElement = document.createElement('div');
      sliderElement.classList.add('zs-slider'); // No I18N
  
      const dragLine = document.createElement('div');
      dragLine.classList.add('zs-drag-line'); // No I18N
      dragLine.innerHTML = '<span>Drag</span>';  // No I18N
  
      const inputSlider = document.createElement('input');
      inputSlider.id = 'zs-input-slider';
      inputSlider.type = 'range';
      inputSlider.tabIndex = -1;
      inputSlider.min = '0';
      inputSlider.max = '100';
      inputSlider.value = '50';
      inputSlider.oninput = () => drag();
  
      sliderElement.append(dragLine, inputSlider);
      addInputSlider.insertAdjacentElement('afterend', sliderElement);  // No I18N
    }
  }
  
  function removeFocusOnVideoElement() {
    let videos = document.querySelectorAll('.zpvideo');
    if(videos) {
      videos.forEach(video => {
        video.addEventListener('focus', (event) => {
          event.preventDefault();
        });
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if(window.zs_rendering_mode !== "canvas") {
      roundText();
      addDragLine();
      removeFocusOnVideoElement();
    }
  });
  