import { loginWith, createBlog } from './helper'

const { test, expect, beforeEach, describe } = require('@playwright/test')

/* 
    Importante:
    Si se intenta ejecutar los tests en paralelo, va a haber un problema de duplicacion del usuario mluukkai, dado que intento crear el mismo usuario para cada prueba.

*/
describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        try {
            console.log('Reseteando base de datos...');
            const resetResponse = await request.post('http://localhost:5173/api/testing/reset');
            if (resetResponse.ok()) {
                console.log('Base de datos reseteada correctamente');
            } else {
                console.error('Error al resetear la base de datos:', resetResponse.status());
                throw new Error('No se pudo resetear la base de datos');
            }

            console.log('Chequeando que no hay usuarios...');
            const usersResponse = await request.get('http://localhost:5173/api/users');
            const users = await usersResponse.json();
            console.log("La cantidad de usuarios es: ", users.length)
    
            console.log('Creando usuario mluukkai...');
            const userResponse = await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'Matti Luukkainen',
                    username: 'mluukkai',
                    password: 'mluukkai'
                }
            });
    
            if (userResponse.ok()) {
                console.log('Usuario creado correctamente');
            } else {
                console.error('Error al crear el usuario:', userResponse.status());
                throw new Error('No se pudo crear el usuario');
            }
    
            await page.goto('http://localhost:5173');
        } catch (error) {
            console.error('Error en el beforeEach:', error);
        }
    });
    
      

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'mluukkai')
            const loggedUser = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('loggedBlogappUser'))
              })
            console.log("El usuario logeado es: ",loggedUser) // Esto se ejecuta en Node.js, y debería aparec
            await expect(page.getByText('logged-in')).toBeVisible()

        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'wrong')
            await expect(page.getByText('Login fallido!')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'mluukkai')
        
            // Espera a que el usuario esté guardado en localStorage
            await page.waitForFunction(() => {
                return localStorage.getItem('loggedBlogappUser') !== null;
            }, {
                timeout: 5000  // Ajusta el tiempo de espera si es necesario
            });
        
            // Verifica si el usuario está guardado en localStorage
            const loggedUser = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('loggedBlogappUser'));
            });
            console.log('Usuario logueado:', loggedUser);
        
            // Asegúrate de que el usuario realmente existe
            expect(loggedUser).toBeDefined();
        });
        
      
        test('a new blog can be created', async ({ page }) => {
            const createdBlog = await createBlog(page, { title: 'un titulo', author: 'un author', url: 'una url' });

            await expect(page.getByTestId(`blog-title-${createdBlog.id}`)).toBeVisible()
            await expect(page.getByTestId(`blog-author-${createdBlog.id}`)).toBeVisible()
        })

        test('a blog can be edited', async ({ page }) => {
            const createdBlog = await createBlog(page, { title: 'un titulo', author: 'un author', url: 'una url' });
            await page.getByTestId(`view-button-${createdBlog.id}`).click(); 
            
            //Clickeo el boton de like
            await page.getByTestId(`like-button-${createdBlog.id}`).click()
            //La cantidad de likes se actualiza correctamente
            await expect(page.getByTestId(`blog-likes-${createdBlog.id}`)).toHaveText('likes 1')
        })

        test('a blog can be deleted', async ({ page }) => {
            const createdBlog = await createBlog(page, { title: 'un titulo', author: 'un author', url: 'una url' });

            await page.getByTestId(`view-button-${createdBlog.id}`).click(); 
        
            // Manejar el diálogo de confirmación
            page.on('dialog', async dialog => {
                // Aceptar el diálogo
                await dialog.accept();
            });
            
            // Haz clic en el botón de eliminar y espera a que aparezca el diálogo
            await page.getByTestId(`remove-button-${createdBlog.id}`).click(); 
            
            // Asegúrate de que el blog ya no es visible
            await expect(page.getByTestId('blog-title')).not.toBeVisible();
        });

        test('cannot delete another user\'s blog', async ({request, page }) => {
            //Creo un blog con el usuario de Matti Luukkainen
            const createdBlog = await createBlog(page, { title: 'un titulo', author: 'un author', url: 'una url' });


            //Creo otro usuario y lo logeo
            console.log('Creando usuario pinga...');
            const userResponse = await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'Nicolas Pinga',
                    username: 'pinga',
                    password: 'pinga'
                }
            });

            await page.goto('http://localhost:5173');
            await page.getByTestId('logout-button').click();
            
            await loginWith(page, 'pinga', 'pinga');
            await expect(page.getByText('logged-in')).toBeVisible()

            //Intento borrar el blog de Matti Luukkainen
            await page.getByTestId(`view-button-${createdBlog.id}`).click(); 

            // Manejar el diálogo de confirmación
            page.once('dialog', async dialog => {
                console.log('Diálogo disparado:', dialog.message()); // Log para verificar el mensaje
                expect(dialog.message()).toEqual('No puedes borrar un blog que no te pertenece');
                await dialog.dismiss();
            });

            // Espera un poco antes de hacer clic, si es necesario
            await page.waitForTimeout(100); // Ajusta el tiempo si es necesario

            // Haz clic en el botón de eliminar y espera a que aparezca el diálogo
            await page.getByTestId(`remove-button-${createdBlog.id}`).click(); 
            
        })

        test("blogs are sorted by likes, where most liked is first", async ({ page }) => {
            // Crear blogs y guardar sus IDs
            const firstBlog = await createBlog(page, { title: 'un titulo', author: 'un author', url: 'una url' });
            const secondBlog = await createBlog(page, { title: 'un segundo titulo', author: 'un segundo author', url: 'una segunda url' });
            const thirdBlog = await createBlog(page, { title: 'un tercer titulo', author: 'un tercer author', url: 'una tercer url' });
            
            console.log("El firstBlog vale: ", firstBlog);
            console.log("El secondBlog vale: ", secondBlog);
            console.log("El thirdBlog vale: ", thirdBlog);
        
            // Expandir los blogs para que los botones de like sean visibles
            await page.getByTestId(`view-button-${firstBlog.id}`).click(); 
            await page.getByTestId(`view-button-${secondBlog.id}`).click(); 
            await page.getByTestId(`view-button-${thirdBlog.id}`).click(); 
        
            // Dar like a cada blog, esperando que el número de likes cambie
            await page.getByTestId(`like-button-${firstBlog.id}`).click(); // Like en el primer blog
            await page.waitForFunction(
                (id) => document.querySelector(`[data-testid="blog-likes-${id}"]`).innerText.includes('1'),
                firstBlog.id
            );
        
            await page.getByTestId(`like-button-${secondBlog.id}`).click(); // Like en el segundo blog
            await page.waitForFunction(
                (id) => document.querySelector(`[data-testid="blog-likes-${id}"]`).innerText.includes('1'),
                secondBlog.id
            );
        
            await page.getByTestId(`like-button-${thirdBlog.id}`).click(); // Like en el tercer blog
            await page.waitForFunction(
                (id) => document.querySelector(`[data-testid="blog-likes-${id}"]`).innerText.includes('1'),
                thirdBlog.id
            );
        
            // Dar un segundo like al segundo blog
            await page.getByTestId(`like-button-${secondBlog.id}`).click();
            await page.waitForFunction(
                (id) => document.querySelector(`[data-testid="blog-likes-${id}"]`).innerText.includes('2'),
                secondBlog.id
            );
        
            // Verificar el número de likes para cada blog
            // const firstBlogCreatedLikes = await page.getByTestId(`blog-likes-${firstBlog.id}`).innerText();
            // const secondBlogCreatedLikes = await page.getByTestId(`blog-likes-${secondBlog.id}`).innerText();
            // const thirdBlogCreatedLikes = await page.getByTestId(`blog-likes-${thirdBlog.id}`).innerText();
        
            // console.log('Los likes de los blogs son:', firstBlogCreatedLikes, secondBlogCreatedLikes, thirdBlogCreatedLikes);
            
            //------------------------------------------
            //Si hago un reload de la pagina, voy a perder el listado de blogs por alguna razon en especial.
            //Lo que hago es deslogearme y volver a logearme en la aplicacion, asi refresco el orden de la lista de blogs
            await page.getByTestId('logout-button').click();

            await loginWith(page, 'mluukkai', 'mluukkai')
            await expect(page.getByText('logged-in')).toBeVisible()
            //---------------------------------------------

            // Verificar el listado de blogs
            const blogElements = await page.$$(`[data-testid^="blog-title-"]`);
            // Verificar el orden de los blogs (El 1er blog del listado debe ser el que mas likes tiene, y es el 2do blog creado!!)
            expect(await blogElements[0].innerText()).toBe(secondBlog.title);
            expect(await blogElements[1].innerText()).toBe(firstBlog.title);
            expect(await blogElements[2].innerText()).toBe(thirdBlog.title);

            
        });
        
        
        
        
    })
})