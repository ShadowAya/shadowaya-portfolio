import Iconify from "@/components/Iconify";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.container}>
      <h2>Pixel 7 Pro</h2>
      <h3>Specs</h3>
      <div className={styles.contents}>
        <div>
          <Iconify icon="ic:outline-crop-portrait" height={30} />
          <span>6.7&quot;</span>
          <span>1440x3120 pixels</span>
        </div>
        <div>
          <Iconify icon="mage:lens" height={30} />
          <span>50 MP</span>
          <span>wide, ultrawide, 5x optical, macro</span>
        </div>
        <div>
          <Iconify icon="mingcute:chip-line" height={30} />
          <span>256GB / 12GB RAM</span>
          <span>Google Tensor G2</span>
        </div>
        <div>
          <Iconify icon="mdi:battery-outline" height={30} />
          <span>5000 mAh</span>
          <span>23W wired & wireless</span>
        </div>
        <div>
          <Iconify icon="proicons:android" height={30} />
          <span>Pixel OS</span>
          <span>Rootless</span>
        </div>
      </div>
      <h3>Extras</h3>
      <div className={styles.contents}>
        <div>
          <Iconify icon="tabler:paint" height={30} />
          <span>Skin</span>
          <span>
            Dbrand&apos;s{" "}
            <a
              target="__blank"
              href="https://dbrand.com/shop/limited-edition/hydrodip"
            >
              Hydrodip
            </a>{" "}
            Collection
          </span>
        </div>
        <div>
          <Iconify icon="iconoir:ev-charge" height={30} />
          <span>Wired Charger</span>
          <span>
            Anker&apos;s{" "}
            <a
              target="__blank"
              href="https://www.anker.com/products/a2637-nano-20w-charger"
            >
              Nano
            </a>{" "}
            chargers for portability.
          </span>
        </div>
        <div>
          <Iconify icon="solar:wireless-charge-linear" height={30} />
          <span>Wireless Charger</span>
          <span>
            Now discontinued{" "}
            <a
              target="__blank"
              href="https://store.google.com/ca/product/pixel_stand_2nd_gen"
            >
              Pixel Stand 2
            </a>{" "}
            for maximum speed
            <br />
            and battery life (built-in fan).
          </span>
        </div>
      </div>
    </div>
  );
}
