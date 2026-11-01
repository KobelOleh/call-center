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

  it('lets only one of two simultaneous Invitations take the last free Seat', async () => {
    const { adminId, companyId, licenceId } = await companyWithLicence(1);
    const invite = (email: string) =>
      h
        .http()
        .post(`/companies/${companyId}/invitations`)
        .set('x-user-id', adminId)
        .send({ email, role: 'operator', licenceId });

    await Promise.all(
      Array.from({ length: 20 }, () => h.http().get(`/companies/${companyId}/licences`).set('x-user-id', adminId)),
    );
    const results = await Promise.all(Array.from({ length: 50 }, (_, i) => invite(`person${i}@acme.com`)));

    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(49);
    const pending = await h.http().get(`/companies/${companyId}/invitations`).set('x-user-id', adminId).expect(200);
    expect(pending.body).toHaveLength(1);
  });

  it('is refused when the Licence has no free Seat', async () => {
    const { adminId, companyId, licenceId } = await companyWithLicence(1);
    await h
      .http()
      .post(`/companies/${companyId}/invitations`)
      .set('x-user-id', adminId)
      .send({ email: 'ivan@acme.com', role: 'operator', licenceId })
      .expect(201);

    const res = await h
      .http()
      .post(`/companies/${companyId}/invitations`)
      .set('x-user-id', adminId)
      .send({ email: 'petro@acme.com', role: 'manager', licenceId });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('NoFreeSeat');
    const pending = await h.http().get(`/companies/${companyId}/invitations`).set('x-user-id', adminId).expect(200);
    expect(pending.body).toHaveLength(1);
  });
});
