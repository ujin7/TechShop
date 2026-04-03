import styles from './ProductSpecTable.module.css';

const LABELS = {
  display: '디스플레이', processor: '프로세서', ram: 'RAM',
  storage: '저장 공간', battery: '배터리', camera: '카메라',
  os: '운영체제', weight: '무게', gpu: 'GPU', ports: '포트',
  size: '화면 크기', resolution: '해상도', panel: '패널',
  refreshRate: '주사율', responseTime: '응답시간', hdr: 'HDR',
  driver: '드라이버', noiseCancelling: '노이즈 캔슬링',
  connectivity: '연결', type: '종류', colors: '색상',
};

export default function ProductSpecTable({ specs = {} }) {
  const entries = Object.entries(specs).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return null;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <th className={styles.label}>{LABELS[key] || key}</th>
              <td className={styles.value}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
