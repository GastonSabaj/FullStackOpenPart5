import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

// test('blog render shows title and author but not url or likes by default', () => {
//     const blog = {
//         title: 'Component testing is done with react-testing-library',
//         author: 'Alex',
//         url: 'https://reactpatterns.com/',
//         likes: 0
//     }

//     render(<Blog blog={blog} />)
//     //screen.debug()
//     // Verifica que el título y el autor están en el documento
//     expect(screen.getByTestId('blog-title')).toBeInTheDocument();
//     expect(screen.getByTestId('blog-author')).toBeInTheDocument();

//     // Verifica que la URL y los likes no están en el documento
//     expect(screen.queryByTestId('blog-url')).not.toBeInTheDocument();
//     expect(screen.queryByTestId('blog-likes')).not.toBeInTheDocument();
// })


// test('url and likes are shown when the button controlling the shown details has been clicked', async () => {
//     const blog = {
//         title: 'Component testing is done with react-testing-library',
//         author: 'Alex',
//         url: 'https://reactpatterns.com/',
//         likes: 0
//     };

//     render(<Blog blog={blog} />);
//     //Simulo un usuario
//     const user = userEvent.setup()
//     const button = screen.getByText('view');
//     // Simulo el clic
//     await user.click(button);

//     //screen.debug();  // Para inspeccionar el HTML renderizado después del clic

//     expect(screen.getByTestId('blog-url')).toBeInTheDocument();
//     expect(screen.getByTestId('blog-likes')).toBeInTheDocument();
// });

// test('clicking the like button twice calls event handler twice', async () => {
//     const blog = {
//         title: 'Component testing is done with react-testing-library',
//         author: 'Alex',
//         url: 'https://reactpatterns.com/',
//         likes: 0
//     };

//     const mockHandler = vi.fn();

//     //Renderizo el componente de blog con una funcion que funciona como handler para saber cuantas veces se ha pulsado
//     render(<Blog blog={blog} onLikeHandler={mockHandler}  />);
//     const user = userEvent.setup()
//     //Obtengo el botón para ver el blog
//     const button = screen.getByText('view');
//     //Clickeo el boton de view y despliego la información detallada del blog
//     await user.click(button);
//     //Obtengo el botón de like 
//     const likeButton = screen.getByText('like');
//     //screen.debug();
//     //Clickeo 2 veces sobre el botón de like
//     await user.click(likeButton);
//     await user.click(likeButton);
//     //Compruebo que la funcion ha sido llamada dos veces
//     expect(mockHandler.mock.calls).toHaveLength(2);
// })

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const mockCreateBlog = vi.fn(); // Función simulada para manejar el envío del formulario
  
    render(<BlogForm createBlog={mockCreateBlog} />); // Renderizamos el formulario con la prop createBlog
  
    const user = userEvent.setup();
    
    //Obtengo la referencia a los campos input del BlogForm
    const titleInput = document.querySelector('input[name="title"]');
    const authorInput = document.querySelector('input[name="author"]');
    const urlInput = document.querySelector('input[name="url"]');
    
    // Simulamos el llenado de los campos del formulario
    await user.type(titleInput, 'Testing React forms');
    await user.type(authorInput, 'John Doe');
    await user.type(urlInput, 'https://testurl.com');
  
    // Simulamos el envío del formulario
    const submitButton = screen.getByText('create'); 
    await user.click(submitButton);
  
    // Verificamos que mockCreateBlog haya sido llamado una vez con los datos correctos
    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing React forms',
      author: 'John Doe',
      url: 'https://testurl.com',
    });
  });