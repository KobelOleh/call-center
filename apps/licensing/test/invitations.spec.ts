import { Harness, startHarness } from './harness.js';

describe('Invitations', () => {
  let h: Harness;
  beforeAll(async () => {
    h = await startHarness();
  });
  afterAll(async () => {
    await h.stop();
  });

  async function companyWithLicence(seats: number) {
    const user = await h.http().post('/users').send({ name: 'Olga' }).expect(201);
    const company = await h.http().post('/companies').set('x-user-id', user.body.id).send({ name: 'Acme' }).expect(201);
    const licence = await h
      .http()
      .post(`/companies/${company.body.id}/licences`)
      .set('x-user-id', user.body.id)
      .send({ tariffPlan: 'standard', seats })
      .expect(201);
    return { adminId: user.body.id as string, companyId: company.body.id as string, licenceId: licence.body.id as string };
  }

  it('holds a Seat while the Invitation is pending', async () => {
    const { adminId, companyId, licenceId } = await companyWithLicence(3);

    await h
      .http()
      .post(`/companies/${companyId}/invitations`)
      .set('x-user-id', adminId)
      .send({ email: 'Ivan@Acme.com ', role: 'operator', licenceId })
      .expect(201);

    const licences = await h.http().get(`/companies/${companyId}/licences`).set('x-user-id', adminId).expect(200);
    expect(licences.body[0]).toMatchObject({ seats: 3, freeSeats: 2 });

    const pending = await h.http().get(`/companies/${companyId}/invitations`).set('x-user-id', adminId).expect(200);
    expect(pending.body).toEqual([{ id: expect.any(String), email: 'ivan@acme.com', role: 'operator', licenceId }]);
  });
});
