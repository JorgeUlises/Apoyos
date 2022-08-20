using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using System.Security.Claims;

namespace Acciones.Controllers
{
    public class CategoriasController : Controller
    {
        private readonly dbAccionesContext _context;

        public CategoriasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Categorias
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            ViewBag.JavaScriptFunction = string.Format("CategoriaSeleccionada(0,0,0,0);");
            //return View(await _context.Categorias.ToListAsync());
            return View();
        }

        public IActionResult Index_2(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            ViewBag.JavaScriptFunction = string.Format("CategoriaSeleccionada(" + id + ",0,0,0);");
            return View("Index");
        }

        // GET: Categorias/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var categoria = await _context.Categorias
                .FirstOrDefaultAsync(m => m.CategoriaId == id);
            if (categoria == null)
            {
                return NotFound();
            }

            return View(categoria);
        }

        // GET: Categorias/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Categorias/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CategoriaId,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId, DiputadoId")] Categoria categoria)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            categoria.Estatus = 1;
            categoria.FechaRegistro = DateTime.Now;
            categoria.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            categoria.UsuarioRegistroId = idUsr;
            categoria.DiputadoId = Int32.Parse(User.FindFirst("DIPUTADO").Value);


            if (ModelState.IsValid)
            {
                _context.Add(categoria);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(categoria);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create_Subcategoria([Bind("CategoriaId,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId, DiputadoId")] Categoria categoria)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (categoria.CategoriaId == 0)
            {
                return RedirectToAction(nameof(Index));
            }

            if (ModelState.IsValid)
            {
                Subcategoria subCat = new Subcategoria();
                subCat.CategoriaId = categoria.CategoriaId;
                subCat.Descripcion = categoria.Descripcion;
                subCat.Estatus = 1;
                subCat.FechaRegistro = DateTime.Now;
                subCat.FechaUltimoCambio = DateTime.Now;
                string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var idUsr = Int32.Parse(idU);
                subCat.UsuarioRegistroId = idUsr;

                _context.Subcategorias.Add(subCat);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index_2), new { id = categoria.CategoriaId });
            }
            //return View(categoria);
            return RedirectToAction(nameof(Index));
        }


        // GET: Categorias/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }
            return View(categoria);
        }

        // POST: Categorias/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CategoriaId,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId, DiputadoId")] Categoria categoria)
        {
            if (id != categoria.CategoriaId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            categoria.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            categoria.UsuarioRegistroId = idUsr;
            categoria.DiputadoId = Int32.Parse(User.FindFirst("DIPUTADO").Value);
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(categoria);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoriaExists(categoria.CategoriaId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(categoria);
        }

        // GET: Categorias/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var categoria = await _context.Categorias
                .FirstOrDefaultAsync(m => m.CategoriaId == id);
            if (categoria == null)
            {
                return NotFound();
            }

            return View(categoria);
        }

        // POST: Categorias/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var categoria = await _context.Categorias.FindAsync(id);
            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.CategoriaId == id);
        }


        /*************************************************************************************
         *  Buscar Categoria
         *************************************************************************************/
        public JsonResult BusquedaCategoria(string term)
        {
            {

                List<ObjCategoria> nombresCategorias = new List<ObjCategoria>();
                if (term.Length == 0)
                {
                    nombresCategorias = _context.Categorias.Select(c => new ObjCategoria { aNombreCategoria = c.Descripcion, id = c.CategoriaId }).ToList();
                }
                else
                {
                    nombresCategorias = _context.Categorias.Where(c => c.Descripcion.Contains(term)).Select(c => new ObjCategoria { aNombreCategoria = c.Descripcion, id = c.CategoriaId }).ToList();
                }

                return Json(nombresCategorias);
            }
        }

        /****************************************************************************
                Obtiene Listado de Categorias
         *****************************************************************************/
        [HttpGet]
        public List<Categoria> ObtieneListaCat(int categoriaId)
        {
            List<Categoria> ListaObjetos = new List<Categoria>();

            ListaObjetos = _context.Categorias.OrderBy(c=>c.Descripcion).ToList();
            return ListaObjetos;
        }


        /****************************************************************************
                Actualiza Categorias
         *****************************************************************************/
        [HttpPut]
        public int ActualizaCategoria(int categoriaId, string descCategoria, int estatus)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            Categoria categoria = _context.Categorias.Where(c => c.CategoriaId == categoriaId).FirstOrDefault();

            categoria.Descripcion = descCategoria;
            categoria.Estatus = estatus;
            categoria.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            categoria.UsuarioRegistroId = idUsr;

            try
            {
                _context.Update(categoria);
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(categoria.CategoriaId))
                {
                    return 0;
                }
                else
                {
                    throw;
                }
            }
            return 1;
        }

        /****************************************************************************
                Elimina Categorias
         *****************************************************************************/
        [HttpDelete]
        public int EliminaCategoria(int categoriaId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            int contador_1 = _context.PeticionCategoria.Where(pc => pc.CategoriaId == categoriaId).Count();
            int contador_2 = _context.GestionCategoria.Where(gc => gc.CategoriaId == categoriaId).Count();

            if (contador_1 == 0 && contador_2 == 0)
            {
                try
                {
                    var ListObj = _context.Subcategorias.Where(sc => sc.CategoriaId == categoriaId);
                    foreach (Subcategoria subC in ListObj)
                    {
                        _context.Subcategorias.Remove(subC);
                        _context.SaveChanges();
                    }

                    var categoria = _context.Categorias.Find(categoriaId);
                    _context.Categorias.Remove(categoria);
                    _context.SaveChangesAsync();

                }
                catch (DbUpdateConcurrencyException)
                {
                        return 0;
                }
            }
            else
            {
                return 2;
            }

            return 1;
        }
        public class ObjCategoria
        {
            public string aNombreCategoria { get; set; }
            public int id { get; set; }
        }

    }
}
