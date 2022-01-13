using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;

namespace Acciones.Controllers
{
    public class ColoniasController : Controller
    {
        private readonly dbAccionesContext _context;

        public ColoniasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Colonias
        public async Task<IActionResult> Index()
        {
            return View(await _context.Colonias.ToListAsync());
        }

        // GET: Colonias/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var colonia = await _context.Colonias
                .FirstOrDefaultAsync(m => m.ColoniaId == id);
            if (colonia == null)
            {
                return NotFound();
            }

            return View(colonia);
        }

        // GET: Colonias/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Colonias/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ColoniaId,NombreColonia,Distrito,Seccion,EstatusColonia,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Colonia colonia)
        {
            if (ModelState.IsValid)
            {
                colonia.FechaRegistro = DateTime.Now;
                colonia.FechaUltimoCambio = DateTime.Now;
                colonia.EstatusColonia = 1;
                colonia.UsuarioRegistroId = 1;

                _context.Add(colonia);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(colonia);
        }

        // GET: Colonias/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var colonia = await _context.Colonias.FindAsync(id);
            if (colonia == null)
            {
                return NotFound();
            }
            return View(colonia);
        }

        // POST: Colonias/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ColoniaId,NombreColonia,Distrito,Seccion,EstatusColonia,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Colonia colonia)
        {
            if (id != colonia.ColoniaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(colonia);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ColoniaExists(colonia.ColoniaId))
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
            return View(colonia);
        }

        // GET: Colonias/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var colonia = await _context.Colonias
                .FirstOrDefaultAsync(m => m.ColoniaId == id);
            if (colonia == null)
            {
                return NotFound();
            }

            return View(colonia);
        }

        // POST: Colonias/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var colonia = await _context.Colonias.FindAsync(id);
            _context.Colonias.Remove(colonia);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ColoniaExists(int id)
        {
            return _context.Colonias.Any(e => e.ColoniaId == id);
        }

        /*************************************************************************************
         *  Buscar Colonia
         *************************************************************************************/ 
        public JsonResult BusquedaColonias(string term)
        {
            {
                var nombresColonias = _context.Colonias.Where(c => c.NombreColonia.Contains(term)).Select(c => new { aNombreColonia = c.NombreColonia, id = c.ColoniaId }).ToList();
                return Json(nombresColonias);
            }
        }

        /************************************************************
            Inserta Nueva Colonia
        *************************************************************/
        [HttpPost]
        public int RegistraNuevaColonia(string nombreColonia)
        {
            if (_context.Colonias.Where(cn=>cn.NombreColonia == nombreColonia).Any())       //  Verifica que no exista una Colonia con el mismo nombre
            {
                return 0;
            }

            Colonia colonia = new Colonia();
            colonia.NombreColonia = nombreColonia;
            colonia.Seccion = "0";
            colonia.Distrito = "0";
            colonia.EstatusColonia = 1;
            colonia.FechaRegistro = DateTime.Now;
            colonia.FechaUltimoCambio = DateTime.Now;
            colonia.UsuarioRegistroId = 1;

            try
            {
                _context.Colonias.Add(colonia);
                _context.SaveChanges();
                if (colonia.ColoniaId != 0)
                {
                    return colonia.ColoniaId;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar una Colonia: {0}", e.Message);
                return -1;
            }
            return colonia.ColoniaId;
        }
    }
}
