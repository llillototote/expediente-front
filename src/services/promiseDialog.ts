import { Dialog } from 'quasar';

let qs: any = { hide: () => { console.log('ok') } }
export { qs }

class _AppDialogService {

  public qs: any;

  async dialogtest() {
    // (un)comment one or move of the tests below
    this.alert('Test Alert', 'All is good, no wait');
    console.log(
      'confirmation',
      await this.confirm('Test Confirm', 'everything ok?', 'really?')
    );
    await this.alert('Test Alert', 'All is good,  wait for dismiss');
    console.log(
      'prompt',
      await this.prompt('Test Prompt', 'What is your favorite color', false)
    );
  }
  async dialog(opts: any = {}) {
    return new Promise(resolve => {
      if (opts.prompt === true) opts.prompt = { model: '', type: 'text' };

      qs = Dialog.create({
        title: opts.title || '',
        message: opts.msg || '',
        cancel: opts.cancel == null ? false : opts.cancel,
        persistent: opts.persist == null ? false : opts.persist,
        prompt: opts.prompt,
        ok: {
          label: opts.ok || 'ok'
        }
      })
        .onOk((res: string) => resolve(opts.confirm ? true : res || ''))
        .onCancel(() => resolve(false));
    });
  }

  async confirm(title: string, msg: string, label: string) {
    return this.dialog({
      title: title,
      msg: msg,
      confirm: true,
      cancel: true,
      persist: true,
      ok: label
    });
  }
  async alert(title: string, msg: string) {
    return this.dialog({ title: title, msg: msg });
  }
  async prompt(title: string, msg: string, prompt: boolean) {
    return this.dialog({
      title: title,
      msg: msg,
      persist: true,
      prompt: prompt || true
    });
  }

  destroy() {
    qs.hide()
  }
}

export default new _AppDialogService();
