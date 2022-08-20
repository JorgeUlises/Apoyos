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
    public class SubcategoriasController : Controller
    {
        private readonly dbAccionesContext _context;

        public SubcategoriasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Subcategorias
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            //var dbAccionesContext = _context.Subcategorias.Include(s => s.Categoria).OrderBy(s => s.CategoriaId);
            var dbAccionesContext = _context.Subcategorias.Include(c => c.Categoria).OrderBy(c=>c.Categoria.Descripcion).ThenBy(sc=>sc.Descripcion);
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Subcategorias/Details/5
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

            var subcategoria = await _context.Subcategorias
                .Include(s => s.Categoria)
                .FirstOrDefaultAsync(m => m.SubcategoriasId == id);
            if (subcategoria == null)
            {
                return NotFound();
            }

            return View(subcategoria);
        }

        // GET: Subcategorias/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["CategoriaId"] = new SelectList(_context.Categorias, "CategoriaId", "CategoriaId");
            return View();
        }

        // POST: Subcategorias/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("SubcategoriasId,CategoriaId,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Subcategoria subcategoria)
        {
            if (ModelState.IsValid)
            {
                _context.Add(subcategoria);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["CategoriaId"] = new SelectList(_context.Categorias, "CategoriaId", "CategoriaId", subcategoria.CategoriaId);
            return View(subcategoria);
        }

        // GET: Subcategorias/Edit/5
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

            var subcategoria = await _context.Subcategorias.FindAsync(id);
            if (subcategoria == null)
            {
                return NotFound();
            }
            ViewData["CategoriaId"] = new SelectList(_context.Categorias, "CategoriaId", "CategoriaId", subcategoria.CategoriaId);
            return View(subcategoria);
        }

        // POST: Subcategorias/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("SubcategoriasId,CategoriaId,Descripcion,Estatus,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Subcategoria subcategoria)
        {
            if (id != subcategoria.SubcategoriasId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            //subcategoria.FechaUltimoCambio = DateTime.Now;
            //string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            //var idUsr = Int32.Parse(idU);
            //subcategoria.UsuarioRegistroId = idUsr;

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(subcategoria);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SubcategoriaExists(subcategoria.SubcategoriasId))
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
            ViewData["CategoriaId"] = new SelectList(_context.Categorias, "CategoriaId", "CategoriaId", subcategoria.CategoriaId);
            //return View(subcategoria);
            return RedirectToAction("Index", "Categorias");
        }

        // GET: Subcategorias/Delete/5
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

            var subcategoria = await _context.Subcategorias
                .Include(s => s.Categoria)
                .FirstOrDefaultAsync(m => m.SubcategoriasId == id);
            if (subcategoria == null)
            {
                return NotFound();
            }

            return View(subcategoria);
        }

        // POST: Subcategorias/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var subcategoria = await _context.Subcategorias.FindAsync(id);
            _context.Subcategorias.Remove(subcategoria);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool SubcategoriaExists(int id)
        {
            return _context.Subcategorias.Any(e => e.SubcategoriasId == id);
        }

        /*************************************************************************************
         *  Buscar Subcategoria
         *************************************************************************************/
        public JsonResult BusquedaSubcategoria(string term, int categoriaId)
        {
            {
                var nombresSubcategorias = _context.Subcategorias.Where(sc => sc.Descripcion.Contains(term) && sc.CategoriaId == categoriaId).OrderBy(sc => sc.Descripcion).Select(c => new { aNombreSubcategoria = c.Descripcion, id = c.SubcategoriasId }).ToList();
                return Json(nombresSubcategorias);
            }
        }

        /****************************************************************************
                Obtiene Listado de Subcategorias correspondientes a una Categoria ID
         *****************************************************************************/
        [HttpGet]
        public List<Subcategoria> ObtieneListaSubCat(int categoriaId)
        {
            List<Subcategoria> ListaObjetos = new List<Subcategoria>();

            ListaObjetos = _context.Subcategorias.Where(sc => sc.CategoriaId == categoriaId).OrderBy(sc=>sc.Descripcion).ToList();
            return ListaObjetos;
        }


        /****************************************************************************
                     Actualiza SubCategorias
         *****************************************************************************/
        [HttpPut]
        public int ActualizaSubCategoria(int subCategoriaId, string descSubCategoria, int estatus)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            Subcategoria subCategoria = _context.Subcategorias.Where(sc => sc.SubcategoriasId == subCategoriaId).FirstOrDefault();

            subCategoria.Descripcion = descSubCategoria;
            subCategoria.Estatus = estatus;
            subCategoria.FechaUltimoCambio = DateTime.Now;
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            subCategoria.UsuarioRegistroId = idUsr;

            try
            {
                _context.Update(subCategoria);
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubcategoriaExists(subCategoria.SubcategoriasId))
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
        public int EliminaSubCategoria(int subCategoriaId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            try
            {
                var subcategoria = _context.Subcategorias.Find(subCategoriaId);
                _context.Subcategorias.Remove(subcategoria);
                _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                return 0;
            }

            return 1;
        }



    }
}
