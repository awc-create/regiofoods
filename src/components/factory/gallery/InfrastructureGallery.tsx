import Image from 'next/image';
import styles from './InfrastructureGallery.module.scss';

const AREAS = [
  {
    id: 'intake',
    title: 'Intake & loading bay',
    caption:
      'Dedicated intake point for approved suppliers, with space for checks before product enters the main building.',
    image: '/images/factory/intake-bay.jpg',
  },
  {
    id: 'prep',
    title: 'Preparation & marination',
    caption:
      'Stainless work surfaces, colour-coded tools and clear segregation between raw and cooked areas.',
    image: '/images/factory/prep-area.jpg',
  },
  {
    id: 'cook',
    title: 'Cooking line & controls',
    caption:
      'Line-of-sight from control panels to the cook step, with digital logs for time and temperature.',
    image: '/images/factory/cook-line.jpg',
  },
  {
    id: 'blast',
    title: 'Chill & blast rooms',
    caption:
      'Chill and blast rooms sized for real volumes, bringing product through the danger zone quickly.',
    image: '/images/factory/blast-room.jpg',
  },
  {
    id: 'cold',
    title: 'Cold store & marshaling',
    caption:
      'Racked cold storage and marshaling space so orders can be built, checked and loaded efficiently.',
    image: '/images/factory/cold-store.jpg',
  },
  {
    id: 'safety',
    title: 'Fire & safety spine',
    caption:
      'Fire panel, exits and extinguishers placed along a central corridor, with routes clearly marked.',
    image: '/images/factory/safety-corridor.jpg',
  },
];

export default function InfrastructureGallery() {
  return (
    <section
      id="factory-gallery"
      className={styles.section}
      aria-labelledby="factory-gallery-heading"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>On the factory floor</p>
        <h2 id="factory-gallery-heading" className={styles.heading}>
          Real spaces behind the process.
        </h2>
        <p className={styles.subheading}>
          A snapshot of the key areas inside the factory – the same zones shown on the map, now in
          real photographs that buyers and auditors can recognise on a site visit.
        </p>
      </div>

      <div className={styles.grid}>
        {AREAS.map((area) => (
          <figure key={area.id} className={styles.card}>
            <div className={styles.mediaWrap}>
              <Image
                src={area.image}
                alt={area.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            </div>
            <figcaption className={styles.caption}>
              <h3 className={styles.title}>{area.title}</h3>
              <p className={styles.text}>{area.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
