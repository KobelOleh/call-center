import { Harness, startHarness } from './harness.js';

describe('Company creation', () => {
  let h: Harness;
  beforeAll(async () => {
    h = await startHarness();
  });
  afterAll(async () => {
    await h.stop();
  });

  it('makes the User who creates a Company its first Company Admin', async () => {
    const user = await h.http().post('/users').send({ name: 'Olga' }).expect(201);

    const company = await h
      .http()
      .post('/companies')
      .set('x-user-id', user.body.id)
      .send({ name: 'Acme Support' })
      .expect(201);

    const members = await h
      .http()
      .get(`/companies/${company.body.id}/members`)
      .set('x-user-id', user.body.id)
      .expect(200);

    expect(members.body).toEqual([{ userId: user.body.id, name: 'Olga', role: 'company-admin' }]);
  });
});
