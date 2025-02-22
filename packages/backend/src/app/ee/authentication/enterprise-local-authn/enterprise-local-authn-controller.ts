import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { enterpriseLocalAuthnService } from './enterprise-local-authn-service'
import { ResetPasswordRequestBody, VerifyEmailRequestBody } from '@activepieces/ee-shared'
import { ALL_PRINICPAL_TYPES } from '@activepieces/shared'
import { eventsHooks } from '../../../helper/audit-events'
import { ApplicationEventName } from '@activepieces/ee-shared'

export const enterpriseLocalAuthnController: FastifyPluginAsyncTypebox = async (app) => {
    app.post('/verify-email', VerifyEmailRequest, async (req) => {
        await enterpriseLocalAuthnService.verifyEmail(req.body)
        eventsHooks.get().send(req, {
            action: ApplicationEventName.VERIFIED_EMAIL,
            userId: req.body.userId,
            projectId: req.principal.projectId,
        })
    })

    app.post('/reset-password', ResetPasswordRequest, async (req) => {
        await enterpriseLocalAuthnService.resetPassword(req.body)
        eventsHooks.get().send(req, {
            action: ApplicationEventName.RESET_PASSWORD,
            userId: req.body.userId,
            projectId: req.principal.projectId,
        })
    })
}

const VerifyEmailRequest = {
    config: {
        allowedPrincipals: ALL_PRINICPAL_TYPES,
    },
    schema: {
        body: VerifyEmailRequestBody,
    },
}

const ResetPasswordRequest = {
    config: {
        allowedPrincipals: ALL_PRINICPAL_TYPES,
    },
    schema: {
        body: ResetPasswordRequestBody,
    },
}
