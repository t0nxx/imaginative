export default class KeyValuePair<K, V> {
  constructor(k: K, v: V) {
    this.key = k;
    this.value = v;
  }
  public key: K;
  public value: V;
}
