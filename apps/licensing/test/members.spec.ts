import { Harness, startHarness } from './harness.js';

describe('Last Company Admin', () => {
  let h: Harness;
  beforeAll(async () => {
    h = await startHarness();
  });
  afterAll(async () => {
    await h.stop();
  });

  async function companyWithOneAdmin() {
    const user = await h.http().post('/users').send({ name: 'Olga', email: `olga${Math.random()}@acme.com` }).expect(201);
    const company = await h.http().post('/companies').set('x-user-id', user.body.id).send({ name: 'Acme' }).expect(201);
    return { adminId: user.body.id as string, companyId: company.body.id as string };
  }

  it('cannot be removed', async () => {
    const { adminId, companyId } = await companyWithOneAdmin();

    const res = await h.http().delete(`/companies/${companyId}/members/${adminId}`).set('x-user-id', adminId);

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('LastCompanyAdmin');
    const members = await h.http().get(`/companies/${companyId}/members`).set('x-user-id', adminId).expect(200);
    expect(members.body).toHaveLength(1);
  });

  it('cannot be demoted', async () => {
    const { adminId, companyId } = await companyWithOneAdmin();

    const res = await h
      .http()
      .patch(`/companies/${companyId}/members/${adminId}`)
      .set('x-user-id', adminId)
      .send({ role: 'operator' });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('LastCompanyAdmin');
    const members = await h.http().get(`/companies/${companyId}/members`).set('x-user-id', adminId).expect(200);
    expect(members.body[0].role).toBe('company-admin');
  });
});
