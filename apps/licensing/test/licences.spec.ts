import { Harness, startHarness } from './harness.js';

describe('Licences and Seats', () => {
  let h: Harness;
  beforeAll(async () => {
    h = await startHarness();
  });
  afterAll(async () => {
    await h.stop();
  });

  it('shows a Company its Licence with the Tariff Plan and free Seats', async () => {
    const user = await h.http().post('/users').send({ name: 'Olga', email: `olga${Math.random()}@acme.com` }).expect(201);
    const company = await h.http().post('/companies').set('x-user-id', user.body.id).send({ name: 'Acme' }).expect(201);

    const licence = await h
      .http()
      .post(`/companies/${company.body.id}/licences`)
      .set('x-user-id', user.body.id)
      .send({ tariffPlan: 'standard', seats: 3 })
      .expect(201);

    const licences = await h
      .http()
      .get(`/companies/${company.body.id}/licences`)
      .set('x-user-id', user.body.id)
      .expect(200);

    expect(licences.body).toEqual([{ id: licence.body.id, tariffPlan: 'standard', seats: 3, freeSeats: 3 }]);
  });
});
