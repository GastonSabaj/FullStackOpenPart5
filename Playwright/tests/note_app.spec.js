import { loginWith, createNote } from './helper'

const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
      try {
        await request.post('http://localhost:5173/api/testing/reset')
        await request.post('http://localhost:5173/api/users', {
          data: {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'mluukkai'
          }
        })
        await page.goto('http://localhost:5173')
      } catch (error) {
        console.error('Error en el beforeEach:', error)
      }
    })
  
    test('user can log in', async ({ page }) => {  
        await loginWith(page, 'mluukkai', 'mluukkai')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'mluukkai')
        })
    
        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright', true)
            await expect(page.getByText('a note created by playwright')).toBeVisible()
        })
        
        //estoy logeado y la nota que creo existe
        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
              await createNote(page, 'first note', true)
              await createNote(page, 'second note', true)
              await createNote(page, 'third note', true)
            })
        
            test('importance can be changed', async ({ page }) => {
              await page.pause()

              const otherNoteText = await page.getByText('second note')
              const otherNoteElement = await otherNoteText.locator('..')
            
              // Esperar que el botón 'make not important' esté presente
              await expect(otherNoteElement.getByRole('button', { name: 'make not important' })).toBeVisible()
            
              // Hacer clic en el botón 'make not important'
              await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
            
              // Esperar a que el texto 'make important' aparezca
              await expect(otherNoteElement.getByRole('button', { name: 'make important' })).toBeVisible({ timeout: 10000 })
            })
            
            
          })
      })  

    test('login fails with wrong password', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })