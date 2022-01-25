<script>
    import {getContext, onMount} from "svelte";
    import {Overlay} from "ol";

    let overlay;
    let popupElem;
    let popupContentElem;
    let closeBtnElem;

    export let title;

    let {map} = getContext('map');

    onMount(() => {
        overlay = new Overlay({
            element: popupElem,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        map.addOverlay(overlay);

        map.on('click', (event) => {
            let features = map.getFeaturesAtPixel(event.pixel);
            if (features.length > 0) {
                let ul = document.createElement('ul');
                features.forEach((feature) => {
                    let li = document.createElement('li');
                    li.appendChild(document.createTextNode(feature.get(title)));
                    ul.appendChild(li);
                })
                let wrap = document.createElement('div');
                wrap.appendChild(ul);
                popupContentElem.innerHTML = wrap.innerHTML;
                overlay.setPosition(event.coordinate);
            }
        })

        closeBtnElem.onclick = function () {
            overlay.setPosition(undefined);
            closeBtnElem.blur();
        };
    })
</script>

<div class="popup" bind:this={popupElem}>
    <button class="popup-close" bind:this={closeBtnElem}>X</button>
    <div class="popup-content" bind:this={popupContentElem}>
        overlay
    </div>
</div>

<style lang="scss">
  .popup {
    background: white;
    box-shadow: 10px 10px 10px 0 rgba(0, 0, 0, 0.2);
    padding: 13px;
    position: relative;

    .popup-close {
      position: absolute;
      top: -6px;
      right: -6px;
      height: 18px;
      width: 18px;
      font-size: 0.7em;
      padding: 0;
    }

    :global(ul) {
      max-height: 200px;
      overflow: auto;
    }

    &:after {
      position: absolute;
      left: calc(50% - 15px);
      content: '';
      height: 15px;
      width: 15px;
      display: block;
      bottom: -15px;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-top: 20px solid #fff;
    }
  }
</style>