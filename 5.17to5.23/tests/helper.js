const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, { title, author, url }) => {
  
  // Abre el formulario para crear un nuevo blog
  await page.getByRole('button', { name: 'new blog' }).click();

  // Llena los campos del formulario
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);

  // Envía el formulario
  await page.getByRole('button', { name: 'create' }).click();

  // Espera a que el mensaje de éxito sea visible
  await page.getByText(`A new blog "${title}" by ${author} added!`).waitFor();

  // Espera un momento para asegurarte de que el blog ha sido agregado correctamente
  await page.waitForTimeout(5000);

  // Captura el último elemento que coincida con `data-testid="blog-title-" , que coincide con el tag que tiene el ID del nuevo blog` 
  const newBlogElements = await page.$$(`[data-testid^="blog-title-"]`);
  const newBlogElement = newBlogElements[newBlogElements.length - 1];

  // Verifica si realmente se encontró el nuevo blog
  if (newBlogElement) {
    console.log("El nuevo blog es: ", await newBlogElement.innerText());
    
    // Extrae el data-testid y el ID como lo hacías antes
    const blogTestId = await newBlogElement.getAttribute('data-testid');
    const blogId = blogTestId.split('-').slice(2).join('-');
    
    return { id: blogId, title, author, url };
  } else {
    console.log("No se encontró el nuevo blog");
  }
};

  

export { loginWith, createBlog }